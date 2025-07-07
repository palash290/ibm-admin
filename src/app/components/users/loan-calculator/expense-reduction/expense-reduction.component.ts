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
  creditList: any;
  propertieList: any;
  loanList: any;
  expensesList: any;
  totalInvestment: any;
  totalExpense: any;
  loading: boolean = false;

  investment_reduction: any = '';
  expense_reduction: any = '0';
  expenseReductionError: string | null = null;
  investmentReductionError: string | null = null;
  selectedExpenses: any;
  selectedInvestmentIds: number[] = [];
  selectedInvestments: any;

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
        this.investmentList = (resp.data.investments || []).map((item: any) => ({
          ...item,
          selected: item.is_checked == 1
        }));

        this.creditList = this.creditExpenseList(resp.data.credit_expense);
        this.propertieList = resp.data.property_expense;
        this.loanList = resp.data.loan_expense;

        this.expensesList = this.prepareExpenseList(resp?.data?.expenses);
        this.totalInvestment = resp.data.total_investment;
        this.totalExpense = parseFloat(resp.data.total_expense).toFixed(2);
        this.investment_reduction = resp.data?.reductions?.monthly_investment_reduction;
        this.expense_reduction = resp.data?.reductions?.monthly_expense_reduction;
      },
      error: error => {
        this.investmentList = [];
        console.log(error.message);
      }
    });
  }

  prepareExpenseList(expenseObj: any): any[] {
    if (!expenseObj || typeof expenseObj !== 'object' || Array.isArray(expenseObj)) {
      console.warn('Invalid expense object:', expenseObj);
      return [];
    }

    return Object.entries(expenseObj)
      .filter(([_, value]: [string, any]) =>
        Array.isArray(value) && parseFloat(value[0] ?? '0') > 0
      )
      .map(([key, value]: [string, any]) => ({
        expense_name: key, // original key for API payload
        display_name: this.formatExpenseKey(key), // pretty name for UI
        amount: parseFloat(value[0] ?? '0'),
        selected: value[1] == 1
      }));
  }

  formatExpenseKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  creditExpenseList(expenseObj: any): any[] {
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

  sibmit() {
    this.validateExpenseReduction();
    this.validateInvestmentReduction();
    if (this.expenseReductionError && this.expenseReductionError) {
      return;
    }
    const payload = {
      monthly_total_investment_allotment: this.totalInvestment,
      monthly_investment_reduction: this.investment_reduction,
      monthly_total_expense: this.totalExpense,
      monthly_expense_reduction: this.expense_reduction,
      case_id: this.client_case_id,
      completed_step: 'client_reduction',
      selectedInvestmentIds: this.selectedInvestments,
      selectedExpenses: this.selectedExpenses,
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

  validateExpenseReduction(): void {
    if (this.expense_reduction === null || this.expense_reduction === undefined || this.expense_reduction === '') {
      this.expenseReductionError = 'Expense reduction is required.';
    } else if (+this.expense_reduction > this.totalExpense) {
      this.expenseReductionError = 'Expense reduction cannot exceed total expenses.';
    } else {
      this.expenseReductionError = null;
    }
  }

  validateInvestmentReduction(): void {
    if (this.investment_reduction === null || this.investment_reduction === undefined || this.investment_reduction === '') {
      this.investmentReductionError = 'Investment reduction is required.';
    } else if (+this.investment_reduction > this.totalInvestment) {
      this.investmentReductionError = 'Investment reduction cannot exceed total investment allotment.';
    } else {
      this.investmentReductionError = null;
    }
  }

  updateSelectedExpenseTotal() {
    this.expense_reduction = this.expensesList
      .filter((item: any) => item.selected)
      .reduce((sum: number, item: { amount: any; }) => sum + Number(item.amount), 0);

    // Build array with name + checked status
    this.selectedExpenses = this.expensesList.map((item: any) => ({
      expense_name: item.expense_name,
      is_checked: item.selected ? 1 : 0
    }));

    console.log('Selected Expenses:', this.selectedExpenses);

  }

  updateSelectedInvestmentTotal() {
    // Calculate the selected items and investment reduction
    const selectedItems = this.investmentList.filter((item: any) => item.selected);

    this.investment_reduction = selectedItems
      .reduce((sum: number, item: any) => sum + parseFloat(item.monthly_allotment), 0);

    // Still keep only selected IDs if you need it
    this.selectedInvestmentIds = selectedItems.map((item: any) => item.id);

    // Build full checked array
    this.selectedInvestments = this.investmentList.map((item: any) => ({
      id: item.id,
      is_checked: item.selected ? 1 : 0
    }));

    console.log('Selected IDs:', this.selectedInvestmentIds);
    console.log('Selected Investments:', this.selectedInvestments);
  }


}
