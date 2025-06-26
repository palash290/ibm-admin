import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-expense-reduction',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './expense-reduction.component.html',
  styleUrl: './expense-reduction.component.css'
})
export class ExpenseReductionComponent {

  client_case_id: any;
  investmentList: any;
  expensesList: any;
  totalInvestment: any;
  totalExpense: any;
  loading: boolean = false;

  constructor(private authService: AuthService, private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    this.client_case_id = sessionStorage.getItem('client_case_id');
    this.getInvastment();
  }

  getInvastment() {
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);
    this.sharedService.postAPI(`get-client-reductions`, formURlData).subscribe({
      next: (resp: any) => {
        this.investmentList = resp.data.investments;
        this.expensesList = this.prepareExpenseList(resp?.data?.expenses?.[0]);
        this.totalInvestment = resp.data.reductions[0].monthly_total_investment_allotment;
        this.totalExpense = resp.data.reductions[0].monthly_total_expense;
        this.investment_reduction = resp.data.reductions[0].monthly_investment_reduction;
        this.expense_reduction = resp.data.reductions[0].monthly_expense_reduction;
      },
      error: error => {
        this.investmentList = [];
        console.log(error.message);
      }
    });
  }

  prepareExpenseList(expenseObj: any): any[] {
    const skipKeys = ['id', 'case_id', 'status', 'created_at', 'updated_at'];

    if (!expenseObj || typeof expenseObj !== 'object' || Array.isArray(expenseObj)) {
      console.warn('Invalid expense object:', expenseObj);
      return [];
    }

    return Object.entries(expenseObj)
      .filter(([key, value]: [any, any]) =>
        !skipKeys.includes(key) && parseFloat(value ?? '0') > 0
      )
      .map(([key, value]: [any, any]) => ({
        name: this.formatExpenseKey(key),
        amount: parseFloat(value ?? '0'),
      }));
  }

  formatExpenseKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  investment_reduction: any = '';
  expense_reduction: any = '';

  sibmit() {
    this.validateExpenseReduction();
    this.validateInvestmentReduction();
    if (this.expenseReductionError && this.expenseReductionError) {
      return; // prevent submit
    }
    const payload = {
      monthly_total_investment_allotment: this.totalInvestment,
      monthly_investment_reduction: this.investment_reduction,
      monthly_total_expense: this.totalExpense,
      monthly_expense_reduction: this.expense_reduction,
      case_id: this.client_case_id,
      completed_step: 'client_reduction',
    };
    this.loading = true;
    this.sharedService.postData(`create-client-reduction`, payload).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.router.navigateByUrl('/user/loan-calculator/final-totals')
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  expenseReductionError: string | null = null;

  validateExpenseReduction(): void {
    if (this.expense_reduction === null || this.expense_reduction === undefined || this.expense_reduction === '') {
      this.expenseReductionError = 'Expense reduction is required.';
    } else if (+this.expense_reduction > this.totalExpense) {
      this.expenseReductionError = 'Expense reduction cannot exceed total expenses.';
    } else {
      this.expenseReductionError = null;
    }
  }

  investmentReductionError: string | null = null;

  validateInvestmentReduction(): void {
    if (this.investment_reduction === null || this.investment_reduction === undefined || this.investment_reduction === '') {
      this.investmentReductionError = 'Investment reduction is required.';
    } else if (+this.investment_reduction > this.totalInvestment) {
      this.investmentReductionError = 'Investment reduction cannot exceed total investment allotment.';
    } else {
      this.investmentReductionError = null;
    }
  }


}
