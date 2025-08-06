import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

import { App } from './app/app';
import { appRoutes } from './app/app.routes';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { AuthGuard } from './app/core/guards/auth.guard';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes),
    provideAnimations(),
    importProvidersFrom(FormsModule, CommonModule),
    AuthGuard 
  ]
}).catch(err => console.error(err));