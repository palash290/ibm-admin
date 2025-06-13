import { Routes } from '@angular/router';
import { RoleGuard } from '../../guard/roleGuard';

export const usersRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./user-home/user-home.component').then(m => m.UserHomeComponent),
        children: [
            {
                path: 'user-dashboard',
                loadComponent: () => import('./user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),

            },
            {
                path: 'loan-calculator',
                loadComponent: () => import('./loan-calculator/loan-calculator.component').then(m => m.LoanCalculatorComponent),

            },
        ],
    }
];
