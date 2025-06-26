import { Routes } from '@angular/router';
import { RoleGuard } from '../../guard/roleGuard';

export const adminRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent),
        children: [
            // {
            //     path: 'admin-dashboard',
            //     loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
            //     canActivate: [RoleGuard], data: { roles: ['Admin'] }
            // },
            {
                path: 'my-profile',
                loadComponent: () => import('../common/my-profile/my-profile.component').then(m => m.MyProfileComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'change-password',
                loadComponent: () => import('../common/change-password/change-password.component').then(m => m.ChangePasswordComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'admin-dashboard',
                loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'sub-admin',
                loadComponent: () => import('./sub-admins/sub-admins.component').then(m => m.SubAdminsComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin'] }
            },
            {
                path: 'permissions',
                loadComponent: () => import('./sub-admins/permissions/permissions.component').then(m => m.PermissionsComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin'] }
            },
            {
                path: 'agents',
                loadComponent: () => import('./agents/agents.component').then(m => m.AgentsComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'view-agent',
                loadComponent: () => import('./agents/view-agent/view-agent.component').then(m => m.ViewAgentComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'clients',
                loadComponent: () => import('../common/clients/clients.component').then(m => m.ClientsComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'view-client',
                loadComponent: () => import('../common/clients/view-client/view-client.component').then(m => m.ViewClientComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'compared-loans',
                loadComponent: () => import('../common/compared-loans/compared-loans.component').then(m => m.ComparedLoansComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'view-compared-loans',
                loadComponent: () => import('../common/compared-loans/view-compared-loans/view-compared-loans.component').then(m => m.ViewComparedLoansComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'reports',
                loadComponent: () => import('../common/reports/reports.component').then(m => m.ReportsComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },
            {
                path: 'view-report',
                loadComponent: () => import('../common/reports/view-report/view-report.component').then(m => m.ViewReportComponent),
                canActivate: [RoleGuard], data: { roles: ['Admin', 'Sub Admin'] }
            },

            // {
            //     path: 'cases',
            //     loadComponent: () => import('../common/cases/cases.component').then(m => m.CasesComponent)
            // },
        ],
    }
];
