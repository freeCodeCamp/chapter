import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
  ServerError,
} from '@apollo/client';
import { NetworkError } from '@apollo/client/errors';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { ChakraProvider } from '@chakra-ui/react';
import { ConfirmContextProvider } from 'chakra-confirm';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement, ReactNode, useEffect } from 'react';

import PageLayout from '../components/PageLayout';
import { UserProvider } from '../modules/auth/user';
import { AuthProvider } from '../modules/auth/context';
import { AlertProvider } from '../components/Alerts/AlertProvider';
import { chapterTheme } from '../styles/themes';

const serverUri = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const httpLink = createHttpLink({
  uri: new URL('/graphql', serverUri).href,
  credentials: 'include',
});

function isServerError(err?: NetworkError): err is ServerError {
  return !(err == null) && 'result' in err && 'statusCode' in err;
}

const errorLink = onError(({ networkError }) => {
  if (isServerError(networkError)) {
    if (networkError.statusCode === 401) {
      // TODO: now we're using cookies, is there anything to do here?
    }
    // TODO: do we want to implement some kind of refresh token instead of
    // forcing the user to log in again?
    if (networkError.result.message === 'Token expired') {
      window.location.href = '/auth/login';
    } else {
      // TODO: do we want to do something else here? We don't want to get stuck
      // in a loop, but we do want to handle broken tokens.
    }
  }
});

const retryLink = new RetryLink();

const client = new ApolloClient({
  link: from([retryLink, errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          paginatedEventsWithTotal: {
            keyArgs: ['showOnlyUpcoming'],
            merge(existing = { total: undefined, events: [] }, incoming) {
              return {
                total: existing.total ?? incoming.total,
                events: [...existing.events, ...incoming.events],
              };
            },
          },
        },
      },
    },
  }),
});

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const CustomApp: React.FC<AppProps> = ({
  pageProps,
  Component,
}: AppPropsWithLayout) => {
  // The isReady/ready shenanigans is used here to make sure the router can be
  // used immediately on all pages.  Otherwise each page requiring the router
  // (most of them) either has to use lazy queries to fetch the data or make at
  // least one invalid request on the renders that happen before isReady.

  // Hopefully, if we rebuild the server in NextJS, we can useStaticProps and
  // eliminate the need for both lazy queries and isReady.
  const { isReady } = useRouter();
  const [ready, setReady] = React.useState(false);
  useEffect(() => {
    if (isReady) {
      setReady(true);
    }
  }, [isReady]);

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        <title>Chapter</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        {process.env.NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT === 'staging' && (
          <meta name="robots" content="noindex" />
        )}
      </Head>
      <ApolloProvider client={client}>
        <ChakraProvider theme={chapterTheme}>
          <AuthProvider>
            <UserProvider>
              <ConfirmContextProvider>
                <AlertProvider>
                  <PageLayout>
                    {ready && getLayout(<Component {...pageProps} />)}
                  </PageLayout>
                </AlertProvider>
              </ConfirmContextProvider>
            </UserProvider>
          </AuthProvider>
        </ChakraProvider>
      </ApolloProvider>
    </>
  );
};

export default CustomApp;
