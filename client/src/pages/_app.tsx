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
import { offsetLimitPagination } from '@apollo/client/utilities';
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import { ConfirmContextProvider } from 'chakra-confirm';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement, ReactNode, useEffect } from 'react';

import PageLayout from '../components/PageLayout';
import { AuthContextProvider } from '../modules/auth/store';
import { DevAuthProvider } from '../modules/auth/store/dev';
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

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          paginatedEvents: offsetLimitPagination(),
        },
      },
    },
  }),
});

// TODO: Reuse this component in Modal
export interface ConditionalWrapProps {
  wrapper:
    | false
    | ((children: React.ReactNode | null | undefined) => JSX.Element);
  children: React.ReactNode;
}

export const ConditionalWrap = (props: ConditionalWrapProps) => {
  const { wrapper: Wrap, children } = props;
  return Wrap ? Wrap(children) : <>{children}</>;
};

const Auth0Wrapper = (children: React.ReactNode) => {
  // TODO: create a module to handle environment variables
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE as string;
  const clientURL = process.env.NEXT_PUBLIC_CLIENT_URL as string;
  {
    /* TODO: Can we conditionally use window.location.origin for the redirectUri if
           we're in the browser? Or should we require site maintainers to supply it? */
  }
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={clientURL}
      audience={audience}
    >
      {children}
    </Auth0Provider>
  );
};

const DevAuthWrapper = (children: React.ReactNode) => (
  <DevAuthProvider>{children}</DevAuthProvider>
);

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
          <ConditionalWrap
            wrapper={
              process.env.NEXT_PUBLIC_USE_AUTH0 === 'true'
                ? Auth0Wrapper
                : DevAuthWrapper
            }
          >
            <AuthContextProvider>
              <ConfirmContextProvider>
                <PageLayout>
                  {ready && getLayout(<Component {...pageProps} />)}
                </PageLayout>
              </ConfirmContextProvider>
            </AuthContextProvider>
          </ConditionalWrap>
        </ChakraProvider>
      </ApolloProvider>
    </>
  );
};

export default CustomApp;
