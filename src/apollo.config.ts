import { EnvironmentProviders, makeEnvironmentProviders, inject } from '@angular/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

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
  // Create cookie service instance
  const cookieService = new CookieService();

  const authLink = setContext((operation, context) => {
    // Get token from COOKIE instead of localStorage
    const token = cookieService.get('jwt_token') || '';

    // Also check for refresh token if needed
    const refreshToken = cookieService.get('refresh_token') || '';

    let headers = context.headers instanceof HttpHeaders
      ? context.headers
      : new HttpHeaders();

    // Add authorization header if token exists
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Optional: Add refresh token header
    if (refreshToken) {
      headers = headers.set('X-Refresh-Token', refreshToken);
    }

    return {
      headers: headers
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
