import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

import { App } from './app/app';
import { appRoutes } from './app/app.routes';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './app/core/guards/auth.guard';

// NEW: imports for interceptors + snackbar
import { TokenInterceptor } from './app/core/interceptors/token.interceptor';
import { UnwrapResponseInterceptor } from './app/core/interceptors/unwrap-response.interceptor';
import { ApiErrorInterceptor } from './app/core/interceptors/api-error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';

bootstrapApplication(App, {
  providers: [
    // IMPORTANT: enable DI-based interceptors
    provideHttpClient(withInterceptorsFromDi()),

    provideRouter(appRoutes),
    provideAnimations(),
    importProvidersFrom(FormsModule, CommonModule, MatSnackBarModule),
    AuthGuard,

    // Register interceptors (order matters)
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor,         multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnwrapResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor,      multi: true },
  ]
}).catch(err => console.error(err));
