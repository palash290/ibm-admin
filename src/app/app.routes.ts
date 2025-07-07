import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/core/login/login.component').then(m => m.LoginComponent), pathMatch: 'full' },
    { path: 'forgot-password', loadComponent: () => import('./components/core/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
    {
        path: 'set-password',
        loadComponent: () => import('./components/common/set-password/set-password.component').then(m => m.SetPasswordComponent)
    },
    {
        path: 'admin', loadChildren: () => import('./components/admin/admin.routes').then(m => m.adminRoutes)
    },
    {
        path: 'agent', loadChildren: () => import('./components/agent/agent.routes').then(m => m.agentRoutes)
    },
    {
        path: 'user', loadChildren: () => import('./components/users/users.routes').then(m => m.usersRoutes)
    },
];
