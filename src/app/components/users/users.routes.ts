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
                canActivate: [RoleGuard], data: { roles: ['Client'] }
            },
            {
                path: 'loan-calculator',
                loadComponent: () => import('./loan-calculator/loan-calculator.component').then(m => m.LoanCalculatorComponent),

                children: [
                    {
                        path: '',
                        loadComponent: () => import('../users/loan-calculator/case-name/case-name.component').then(m => m.CaseNameComponent)
                    },
                    {
                        path: 'case-type',
                        loadComponent: () => import('../users/loan-calculator/case-type/case-type.component').then(m => m.CaseTypeComponent)
                    },
                    {
                        path: 'people-details',
                        loadComponent: () => import('../users/loan-calculator/people-datails/people-datails.component').then(m => m.PeopleDatailsComponent)
                    },
                    {
                        path: 'property-details',
                        loadComponent: () => import('../users/loan-calculator/property-datails/property-datails.component').then(m => m.PropertyDatailsComponent)
                    },
                    {
                        path: 'credit-details',
                        loadComponent: () => import('../users/loan-calculator/credit-datails/credit-datails.component').then(m => m.CreditDatailsComponent)
                    },
                    {
                        path: 'loan-details',
                        loadComponent: () => import('../users/loan-calculator/loan-datails/loan-datails.component').then(m => m.LoanDatailsComponent)
                    },
                    {
                        path: 'investment',
                        loadComponent: () => import('../users/loan-calculator/investment/investment.component').then(m => m.InvestmentComponent)
                    },
                    {
                        path: 'monthly-expenses',
                        loadComponent: () => import('../users/loan-calculator/monthly-expenses/monthly-expenses.component').then(m => m.MonthlyExpensesComponent)
                    },
                    {
                        path: 'totals',
                        loadComponent: () => import('../users/loan-calculator/totals/totals.component').then(m => m.TotalsComponent)
                    },
                    {
                        path: 'expense-reduction',
                        loadComponent: () => import('../users/loan-calculator/expense-reduction/expense-reduction.component').then(m => m.ExpenseReductionComponent)
                    },
                    {
                        path: 'final-totals',
                        loadComponent: () => import('../users/loan-calculator/final-totals/final-totals.component').then(m => m.FinalTotalsComponent)
                    },
                    {
                        path: 'loan-comparision',
                        loadComponent: () => import('../users/loan-calculator/loan-comparision/loan-comparision.component').then(m => m.LoanComparisionComponent)
                    },
                    {
                        path: 'policies',
                        loadComponent: () => import('../users/loan-calculator/policies/policies.component').then(m => m.PoliciesComponent)
                    },
                    {
                        path: 'combined-policies',
                        loadComponent: () => import('../users/loan-calculator/combined-policies/combined-policies.component').then(m => m.CombinedPoliciesComponent)
                    },
                    {
                        path: 'insurance-suggestions',
                        loadComponent: () => import('../users/loan-calculator/insurance-suggestions/insurance-suggestions.component').then(m => m.InsuranceSuggestionsComponent)
                    },
                    // {
                    //     path: 'final-report',
                    //     loadComponent: () => import('../users/loan-calculator/final-report/final-report.component').then(m => m.FinalReportComponent)
                    // },
                ]
            },
            {
                path: 'final-report',
                loadComponent: () => import('../users/loan-calculator/final-report/final-report.component').then(m => m.FinalReportComponent)
            },
            {
                path: 'my-profile',
                loadComponent: () => import('../common/my-profile/my-profile.component').then(m => m.MyProfileComponent),
                canActivate: [RoleGuard], data: { roles: ['Client'] }
            },
            {
                path: 'change-password',
                loadComponent: () => import('../common/change-password/change-password.component').then(m => m.ChangePasswordComponent),
                canActivate: [RoleGuard], data: { roles: ['Client'] }
            },
            {
                path: 'cases',
                loadComponent: () => import('../common/cases/cases.component').then(m => m.CasesComponent),
                canActivate: [RoleGuard], data: { roles: ['Client'] }
            },

            {
                path: 'compared-loans',
                loadComponent: () => import('../common/compared-loans/compared-loans.component').then(m => m.ComparedLoansComponent),
                canActivate: [RoleGuard], data: { roles: ['Client'] }
            },
            {
                path: 'view-compared-loans',
                loadComponent: () => import('../common/compared-loans/view-compared-loans/view-compared-loans.component').then(m => m.ViewComparedLoansComponent),
                canActivate: [RoleGuard], data: { roles: ['Client'] }
            },
            {
                path: 'reports',
                loadComponent: () => import('../common/reports/reports.component').then(m => m.ReportsComponent),
                canActivate: [RoleGuard], data: { roles: ['Client'] }
            },
            {
                path: 'view-report',
                loadComponent: () => import('../common/reports/view-report/view-report.component').then(m => m.ViewReportComponent),
                canActivate: [RoleGuard], data: { roles: ['Client'] }
            },
        ],
    }
];
