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
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

import PageLayout from '../components/PageLayout';
import { AuthContextProvider } from '../modules/auth/store';

const serverUri =
  process.env.NEXT_PUBLIC_APOLLO_SERVER || 'http://localhost:5000';

const httpLink = createHttpLink({
  uri: new URL('/graphql', serverUri).href,
  credentials: 'include',
});

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

function isServerError(err?: NetworkError): err is ServerError {
  return !(err == null) && 'result' in err && 'statusCode' in err;
}

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

const CustomApp: React.FC<AppProps> = ({ pageProps, Component }) => {
  // TODO: create a module to handle environment variables
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE as string;
  const clientURL = process.env.NEXT_PUBLIC_CLIENT_URL as string;

  return (
    <>
      <Head>
        <title>Chapter</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <ApolloProvider client={client}>
        <ChakraProvider>
          {/* TODO: Can we conditionally use window.location.origin for the redirectUri if
           we're in the browser? Or should we require site maintainers to supply it? */}
          <Auth0Provider
            domain={domain}
            clientId={clientId}
            redirectUri={clientURL}
            audience={audience}
            scope="read:current_user update:current_user_metadata"
          >
            <AuthContextProvider>
              <ConfirmContextProvider>
                <PageLayout>
                  <Component {...pageProps} />
                </PageLayout>
              </ConfirmContextProvider>
            </AuthContextProvider>
          </Auth0Provider>
        </ChakraProvider>
      </ApolloProvider>
    </>
  );
};

export default CustomApp;
