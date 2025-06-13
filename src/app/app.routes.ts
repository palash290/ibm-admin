import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/core/login/login.component').then(m => m.LoginComponent), pathMatch: 'full' },
    { path: 'forgot-password', loadComponent: () => import('./components/core/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
    {
        path: 'set-password',
        loadComponent: () => import('./components/common/set-password/set-password.component').then(m => m.SetPasswordComponent)
    },
    // {
    //     path: 'home',
    //     component: RootComponent,
    //     children: [
    //         {
    //             path: 'dashboard',
    //             loadComponent: () =>
    //                 import('./components/main/dashboard/dashboard.component').then(m => m.DashboardComponent)
    //         },
    //         {
    //             path: 'sub-admins',
    //             loadComponent: () =>
    //                 import('./components/main/sub-admins/sub-admins.component').then(m => m.SubAdminsComponent)
    //         },
    //         {
    //             path: 'permissions',
    //             loadComponent: () =>
    //                 import('./components/main/sub-admins/permissions/permissions.component').then(m => m.PermissionsComponent)
    //         },
    //         {
    //             path: 'agents',
    //             loadComponent: () =>
    //                 import('./components/main/agents/agents.component').then(m => m.AgentsComponent)
    //         },
    //         {
    //             path: 'clients',
    //             loadComponent: () =>
    //                 import('./components/main/clients/clients.component').then(m => m.ClientsComponent)
    //         },
    //         {
    //             path: 'compared-loans',
    //             loadComponent: () =>
    //                 import('./components/main/compared-loans/compared-loans.component').then(m => m.ComparedLoansComponent)
    //         },
    //         {
    //             path: 'reports',
    //             loadComponent: () =>
    //                 import('./components/main/reports/reports.component').then(m => m.ReportsComponent)
    //         },

    //     ]
    // },
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
