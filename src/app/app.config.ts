import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { importProvidersFrom } from "@angular/core";
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialLoginModule, SocialUser } from '@abacritt/angularx-social-login';
import { TokenInterceptor } from '../TokenInterceptor';

export function provideHttpInterceptors() {
  return [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ];
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, SocialLoginModule, SocialAuthService, SocialUser),
    ...provideHttpInterceptors(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('343995519352-dr238iivsa9neb7dqp4unb8k6j8lg7jf.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('788576123304697'),
          },
        ],
        onError: (err) => console.error(err),
      } as SocialAuthServiceConfig,
    }
  ]
};
