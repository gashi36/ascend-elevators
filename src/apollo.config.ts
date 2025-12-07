import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { HttpHeaders } from '@angular/common/http';

const GRAPHQL_URI = 'https://localhost:5001/graphql';

// --- 1. Error Link ---
const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }: any) =>
      console.error(
        `[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.error(`[Network Error]: ${networkError.message}`);
  }
});

// --- 2. Apollo Factory ---
export function createApollo(httpLink: HttpLink) {

  // Authentication Link
  const authLink = setContext((operation, context) => {
    const token = localStorage.getItem('jwt_token') || '';

    // Convert existing headers (if any) into HttpHeaders
    let headers = new HttpHeaders(context.headers as any || {});
    headers = headers.set('Authorization', token ? `Bearer ${token}` : '');

    return {
      headers,
    };
  });

  // HTTP Link
  const http = httpLink.create({ uri: GRAPHQL_URI });

  // Compose links: Error -> Auth -> HTTP
  const link = ApolloLink.from([errorLink, authLink]).concat(http);

  return {
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-and-network' },
      query: { fetchPolicy: 'network-only' },
      mutate: { fetchPolicy: 'network-only' },
    },
  };
}

// --- 3. Provide Apollo in Angular Standalone ---
export const provideApolloClient: EnvironmentProviders = makeEnvironmentProviders([
  HttpLink,
  {
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink],
  },
  Apollo,
]);
