import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-case-wizard-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-wizard-steps.component.html',
  styleUrl: './case-wizard-steps.component.css'
})
export class CaseWizardStepsComponent {

  currentStep = '';
  basePath = '/loan-calculator';

  steps = [
    { path: '', label: 'Case Name', icon: 'assets/img/case_name_icon.png' },
    { path: 'case-type', label: 'Select Case Type', icon: 'assets/img/select_case_icon.png' },
    { path: 'people-details', label: 'People', icon: 'assets/img/peoples_icon.png' },
    { path: 'property-details', label: 'Property(s)', icon: 'assets/img/propertys_icon.png' },
    { path: 'credit-details', label: 'Credit', icon: 'assets/img/credit_icon.png' },
    { path: 'loan-details', label: 'Loans', icon: 'assets/img/loans_icon.png' },
    { path: 'investment', label: 'Investment', icon: 'assets/img/investment_icon.png' },
    { path: 'monthly-expenses', label: 'Monthly Expenses', icon: 'assets/img/monthly_expence_icon.png' },
    { path: 'totals', label: 'Totals', icon: 'assets/img/totals.png' },
    { path: 'expense-reduction', label: 'Expense Reduction', icon: 'assets/img/totals.png' },
    { path: 'final-totals', label: 'Final Totals', icon: 'assets/img/totals.png' },
    { path: 'loan-comparision', label: 'Loan Comparison', icon: 'assets/img/loan_comaparision_icon.png' },
    { path: 'policies', label: 'Policies', icon: 'assets/img/policy_icon.png' },
    { path: 'combined-policies', label: 'Combined Policies Projections', icon: 'assets/img/combine_policy_icon.png' },
    { path: 'insurance-suggestions', label: 'Insurance Suggestions', icon: 'assets/img/insurance_icon.png' },
    { path: 'final-report', label: 'Final Report', icon: 'assets/img/final_report_icon.png' }
  ];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.setCurrentStepFromUrl(this.router.url);
    // this.router.events.subscribe(() => {
    //   const fullUrl = this.router.url;
    //   const stepPath = fullUrl.split('/loan-calculator/')[1] || '';
    //   this.currentStep = stepPath.trim();
    // });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setCurrentStepFromUrl(event.urlAfterRedirects);
      }
    });
  }

  private setCurrentStepFromUrl(url: string): void {
    const match = url.match(/loan-calculator\/([^\/]+)/);
    this.currentStep = match ? match[1] : '';
  }

  goToStep(step: string): void {
    this.router.navigate([this.basePath, step]);
  }

  isActiveStep(stepPath: string): boolean {
    return this.currentStep == stepPath;
  }


}
