import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-loan-datails',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './loan-datails.component.html',
  styleUrl: './loan-datails.component.css'
})
export class LoanDatailsComponent {

  form: FormGroup;
  client_case_id: any;
  apiLoanData: any[] = [];
  loading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private service: SharedService) {
    this.form = this.fb.group({
      loans: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id');

    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.service.postAPI(`get-client-loans`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.apiLoanData = resp.data.reverse();
          this.populateLoans(this.apiLoanData);
        } else {
          this.apiLoanData = [];
        }
      },
      error: error => {
        this.apiLoanData = [0];
        console.log(error.message);
        this.addLoan();
      }
    });
  }

  populateLoans(data: any[]): void {
    data.forEach(credit => {
      const group = this.fb.group({
        loan_name: [credit.loan_name || '', Validators.required],
        financed_amount: [credit.financed_amount || '', Validators.required],
        start_date: [this.formatDate(credit.start_date) || '', Validators.required],
        terms: [credit.terms || '', Validators.required],
        interest_rate: [credit.interest_rate || '', Validators.required],
        current_balance: [{ value: credit.current_balance || '', disabled: true }, Validators.required],
        monthly_emi: [{ value: credit.monthly_emi || '', disabled: true }, Validators.required],
      });
      group.get('financed_amount')?.valueChanges.subscribe(() => this.updateLoanCalculations(group));
      group.get('interest_rate')?.valueChanges.subscribe(() => this.updateLoanCalculations(group));
      group.get('terms')?.valueChanges.subscribe(() => this.updateLoanCalculations(group));

      this.loans.push(group);

    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Outputs YYYY-MM-DD
  }


  get loans(): FormArray {
    return this.form.get('loans') as FormArray;
  }

  addLoan(): void {
    const group = this.fb.group({
      loan_name: ['', Validators.required],
      financed_amount: ['', Validators.required],
      start_date: ['', Validators.required],
      terms: ['', Validators.required], // in months
      interest_rate: ['', Validators.required], // annual %
      current_balance: [{ value: '', disabled: true }, Validators.required],
      monthly_emi: [{ value: '', disabled: true }, Validators.required]
    });

    // Attach value change subscriptions
    group.get('financed_amount')?.valueChanges.subscribe(() => this.updateLoanCalculations(group));
    group.get('interest_rate')?.valueChanges.subscribe(() => this.updateLoanCalculations(group));
    group.get('terms')?.valueChanges.subscribe(() => this.updateLoanCalculations(group));

    this.loans.push(group);
  }

  updateLoanCalculations(group: FormGroup): void {
    const principal = parseFloat(group.get('financed_amount')?.value || '0');
    const annualInterestRate = parseFloat(group.get('interest_rate')?.value || '0');
    const months = parseFloat(group.get('terms')?.value || '0'); // 🔄 terms in months directly

    if (principal > 0 && annualInterestRate >= 0 && months > 0) {
      const monthlyRate = annualInterestRate / 12 / 100;

      let monthlyEMI = 0;

      if (monthlyRate > 0) {
        const factor = Math.pow(1 + monthlyRate, months);
        monthlyEMI = (principal * monthlyRate * factor) / (factor - 1);
      } else {
        monthlyEMI = principal / months;
      }

      const totalPayable = monthlyEMI * months;

      group.get('monthly_emi')?.setValue(monthlyEMI.toFixed(2), { emitEvent: false });
      group.get('current_balance')?.setValue(totalPayable.toFixed(2), { emitEvent: false });
    } else {
      group.get('monthly_emi')?.setValue('', { emitEvent: false });
      group.get('current_balance')?.setValue('', { emitEvent: false });
    }
  }


  removeLoan(index: number): void {
    this.loans.removeAt(index);
  }

  submit(): void {
    // this.router.navigateByUrl('/user/loan-calculator/investment')
    // return
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      console.warn('Form is invalid');
      //this.form.markAllAsTouched();
      return;
    }
    console.log('Loan Details:', this.form.value.loans);

    const payload = {
      case_id: this.client_case_id,
      completed_step: 'client_loan',
      loans: this.form.getRawValue().loans
    };
    this.loading = true;
    this.service.postData(`create-client-loan`, payload).subscribe({
      next: (resp: any) => {
        //this.apiPeopleData = resp.users;
        this.loading = false;
        this.router.navigateByUrl('/user/loan-calculator/investment')
      },
      error: error => {
        this.loading = false;
        //this.apiPeopleData = [];
        console.log(error.message);
      }
    });
  }


}
