import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-monthly-expenses',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './monthly-expenses.component.html',
  styleUrl: './monthly-expenses.component.css'
})
export class MonthlyExpensesComponent {

  form: FormGroup;
  client_case_id: any;
  apiExpData: any[] = [];

  defaultExpenses = [
    { key: 'food', label: 'Food' },
    { key: 'clothing_personal_items', label: 'Clothing/Personal Items' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'travel', label: 'Travel' },
    { key: 'cell_phones_and_subscriptions', label: 'Cell Phones and Subscriptions' },//new
    { key: 'fees_and_education', label: 'Fees & Education' },
    { key: 'term_life_insurance', label: 'Term Life Insurance' },
    { key: 'di_ci_insurance', label: 'DI/CI Insurance' },
    { key: 'health_gym_fees', label: 'Health/Gym Fees' },
    { key: 'kids_activities_sports', label: 'Kids Activities/Sports' },
    { key: 'day_care', label: 'Day Care' },
    { key: 'child_support', label: 'Child Support' },
    { key: 'vehicle_insurance', label: 'Vehicle Insurance' },
    { key: 'vehicle_gas', label: 'Vehicle Gas' },
    { key: 'vehicle_maintenance', label: 'Vehicle Maintenance' },
    { key: 'vehicle_leases', label: 'Vehicle Leases' },
    { key: 'tax_installment', label: 'Tax Installment' },
    { key: 'gifts', label: 'Gifts' },//new
    { key: 'additional_expenses', label: 'Additional Expenses' },
    { key: 'others', label: 'Others' }//new
  ];


  constructor(private fb: FormBuilder, private router: Router, private service: SharedService) {
    this.form = this.fb.group({
      expenses: this.fb.array([]),
    });
  }

  get expenses(): FormArray {
    return this.form.get('expenses') as FormArray;
  }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id');
    // Initialize default expenses
    this.defaultExpenses.forEach(exp => {
      this.expenses.push(this.fb.group({
        key: [exp.key],
        label: [exp.label],
        amount: []
      }));
    });

    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.service.postAPI(`get-client-expenses`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success && resp.data.length > 0) {
          this.apiExpData = resp.data.reverse(); // reverse not necessary if only 1 record
          this.populateExpenses(this.apiExpData[0]); // send first object to populate
        } else {
          this.apiExpData = [];
        }
      },
      error: error => {
        this.apiExpData = [];
        console.log(error.message);
      }
    });
  }

  populateExpenses(apiData: any): void {
    this.expenses.controls.forEach(expenseControl => {
      const key = expenseControl.get('key')?.value;
      if (apiData.hasOwnProperty(key)) {
        const rawValue = apiData[key];
        const numericValue = parseFloat(rawValue);
        if (!isNaN(numericValue) && numericValue > 0) {
          expenseControl.get('amount')?.setValue(numericValue);
        }
      }
    });
  }


  addCustomExpense(): void {
    this.expenses.push(this.fb.group({
      label: [''],
      amount: []
    }));
  }

  removeExpense(index: number): void {
    // Prevent removing default expenses
    if (index >= this.defaultExpenses.length) {
      this.expenses.removeAt(index);
    }
  }

  submit(): void {
    //this.router.navigateByUrl('/user/loan-calculator/totals')
    const enteredExpenses = this.form.value.expenses
      .filter((expense: any) => expense.amount !== null && expense.amount !== '' && +expense.amount > 0)
      .reduce((acc: any, expense: any) => {
        acc[expense.key] = +expense.amount;
        return acc;
      }, {});

    console.log('Entered Expenses:', enteredExpenses);

    const payload = {
      case_id: this.client_case_id,
      completed_step: 'client_expenses',
      expenses: [enteredExpenses]
    };

    this.service.postData(`create-client-expense`, payload).subscribe({
      next: (resp: any) => {
        //this.apiPeopleData = resp.users;
        this.router.navigateByUrl('/user/loan-calculator/totals')
      },
      error: error => {
        //this.apiPeopleData = [];
        console.log(error.message);
      }
    });
  }


}
