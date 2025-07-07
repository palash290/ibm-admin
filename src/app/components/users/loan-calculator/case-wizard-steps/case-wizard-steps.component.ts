import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-case-wizard-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-wizard-steps.component.html',
  styleUrl: './case-wizard-steps.component.css'
})
export class CaseWizardStepsComponent {

  client_case_id = this.service.caseId;
  currentStep = '';
  basePath = '/user/loan-calculator/';
  userRole: any;
  steps: any[] = [];
  selectedCaseType: any = '';


  buildSteps() {
    // Your full step list
    const allSteps = [
      { path: '', label: 'Case Name', icon: 'assets/img/case_name_icon.png' },
      { path: 'case-type', label: 'Select Case Type', icon: 'assets/img/select_case_icon.png' },
      { path: 'people-details', label: 'People', icon: 'assets/img/peoples_icon.png' },
      { path: 'property-details', label: 'Property(s)', icon: 'assets/img/propertys_icon.png' },
      { path: 'credit-details', label: 'Credit', icon: 'assets/img/credit_icon.png' },
      { path: 'loan-details', label: 'Loans', icon: 'assets/img/loans_icon.png' },
      { path: 'investment', label: 'Investment', icon: 'assets/img/investment_icon.png' },
      { path: 'monthly-expenses', label: 'Monthly Expenses', icon: 'assets/img/monthly_expence_icon.png' },
      { path: 'totals', label: 'Totals', icon: 'assets/img/totals.png' },
      { path: 'expense-reduction', label: 'Expense Reduction', icon: 'assets/img/exp_red.png' },
      { path: 'final-totals', label: 'Final Totals', icon: 'assets/img/ft.png' },
      // { path: 'loan-comparision', label: 'Loan Comparison', icon: 'assets/img/loan_comaparision_icon.png' },
      { path: 'policies', label: 'Policies', icon: 'assets/img/policy_icon.png' },
      { path: 'combined-policies', label: 'Combined Policies', icon: 'assets/img/combine_policy_icon.png' },
      // { path: 'insurance-suggestions', label: 'Insurance Suggestions', icon: 'assets/img/insurance_icon.png' },
      { path: 'final-report', label: 'Final Report', icon: 'assets/img/final_report_icon.png' }
    ];

    // Filter based on selectedCaseType
    if (this.selectedCaseType == 4) {
      this.steps = allSteps.filter(step => step.path !== 'property-details');
    } else {
      this.steps = allSteps;
    }

    // Filter based on userRole
    if (this.userRole == 'Client') {
      const excludedSteps = [
        'policies',
        'combined-policies',
        'final-report'
        // 'insurance-suggestions',
        // 'loan-comparision',
      ];
      this.steps = allSteps.filter(step => !excludedSteps.includes(step.path));
    } else {
      this.steps = allSteps;
    }

  }

  constructor(private router: Router, private authService: AuthService, private service: SharedService) {
    effect(() => {
      this.client_case_id();
    });
  }

  ngOnInit(): void {
    // this.selectedCaseType = sessionStorage.getItem('selectedCaseType');
    this.userRole = this.authService.getUserRole();
    this.service.selectedCaseType$.subscribe(type => {
      this.selectedCaseType = type || parseInt(sessionStorage.getItem('selectedCaseType') || '');
      this.buildSteps();
    });

    let caseId = sessionStorage.getItem('client_case_id');
    if (caseId) {
      this.service.caseId.set(caseId)
    }
    this.buildSteps();

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
    if (this.client_case_id()) {
      this.router.navigate([this.basePath, step]);
    }
  }

  isActiveStep(stepPath: string): boolean {
    return this.currentStep == stepPath;
  }


}
