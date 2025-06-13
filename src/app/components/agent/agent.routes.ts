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
                loadComponent: () => import('./agent-dashboard/agent-dashboard.component').then(m => m.AgentDashboardComponent)
            },
            // {
            //     path: 'agent-dashboard',
            //     loadComponent: () => import('../admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
            // },
            {
                path: 'cases',
                loadComponent: () => import('../common/cases/cases.component').then(m => m.CasesComponent)
            },
            {
                path: 'clients',
                loadComponent: () => import('../common/clients/clients.component').then(m => m.ClientsComponent)
            },
            {
                path: 'view-client',
                loadComponent: () => import('../common/clients/view-client/view-client.component').then(m => m.ViewClientComponent)
            },
            // {
            //     path: 'set-password',
            //     loadComponent: () => import('../common/set-password/set-password.component').then(m => m.SetPasswordComponent)
            // },
        ],
    }
];
