import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { TaskManagerComponent } from './features/task-manager/task-manager.component';
import { AuthGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'tasks',
        component: TaskManagerComponent,
        canActivate: [AuthGuard]
    },
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: '**', redirectTo: 'tasks' }
];