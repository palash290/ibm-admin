import { Routes } from '@angular/router';
import { RoleGuard } from '../../guard/roleGuard';

export const agentRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./agent-home/agent-home.component').then(m => m.AgentHomeComponent),
        children: [
            {
                path: 'agent-dashboard',
                loadComponent: () => import('./agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            {
                path: 'my-profile',
                loadComponent: () => import('../common/my-profile/my-profile.component').then(m => m.MyProfileComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            {
                path: 'change-password',
                loadComponent: () => import('../common/change-password/change-password.component').then(m => m.ChangePasswordComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            // {
            //     path: 'agent-dashboard',
            //     loadComponent: () => import('../admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            // },
            {
                path: 'cases',
                loadComponent: () => import('../common/cases/cases.component').then(m => m.CasesComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            {
                path: 'clients',
                loadComponent: () => import('../common/clients/clients.component').then(m => m.ClientsComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            {
                path: 'view-client',
                loadComponent: () => import('../common/clients/view-client/view-client.component').then(m => m.ViewClientComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            // {
            //     path: 'set-password',
            //     loadComponent: () => import('../common/set-password/set-password.component').then(m => m.SetPasswordComponent)
            // },

            {
                path: 'compared-loans',
                loadComponent: () => import('../common/compared-loans/compared-loans.component').then(m => m.ComparedLoansComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            {
                path: 'view-compared-loans',
                loadComponent: () => import('../common/compared-loans/view-compared-loans/view-compared-loans.component').then(m => m.ViewComparedLoansComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            {
                path: 'reports',
                loadComponent: () => import('../common/reports/reports.component').then(m => m.ReportsComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
            {
                path: 'view-report',
                loadComponent: () => import('../common/reports/view-report/view-report.component').then(m => m.ViewReportComponent),
                canActivate: [RoleGuard], data: { roles: ['Agent'] }
            },
        ],
    }
];
