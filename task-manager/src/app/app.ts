import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TaskManagerComponent } from './features/task-manager/task-manager.component';
import { RegisterComponent } from './features/auth/register/register.component';

bootstrapApplication(RegisterComponent, {
  providers: [
    provideAnimations(),
    importProvidersFrom(FormsModule, CommonModule)
  ]
}).catch(err => console.error(err));
