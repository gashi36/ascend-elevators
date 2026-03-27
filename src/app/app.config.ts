import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideApolloClient } from '../apollo.config';

// Fixed: provideApolloClient was defined in apollo.config.ts but never registered here.
// Without it every GraphQL call throws "No provider for Apollo" at runtime.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),   // required by apollo-angular's HttpLink
    provideApolloClient,   // registers Apollo, HttpLink, and APOLLO_OPTIONS
  ]
};
