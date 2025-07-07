import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-datails',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './property-datails.component.html',
  styleUrl: './property-datails.component.css'
})
export class PropertyDatailsComponent {

  selectedCaseType: any;
  form: FormGroup;
  client_case_id: any;
  apiPropertyData: any[] = [];
  loading: boolean = false;
  minDate: any;

  constructor(private fb: FormBuilder, private router: Router, private service: SharedService) {
    this.form = this.fb.group({
      properties: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id');
    this.selectedCaseType = sessionStorage.getItem('selectedCaseType');

    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.service.postAPI(`get-client-properties`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.apiPropertyData = resp.data.reverse();
          this.populateProperty(this.apiPropertyData);
        } else {
          this.apiPropertyData = [];
        }
      },
      error: error => {
        this.apiPropertyData = [0];
        console.log(error.message);
        this.addProperty();
      }
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  populateProperty(data: any[]): void {

    const isRequired = this.selectedCaseType !== '3';
    const showHelocFields = this.selectedCaseType !== '1' && this.selectedCaseType !== '3';
    //const showMonthlyExpenses = this.selectedCaseType !== '1';

    data.forEach(prop => {
      const group = this.fb.group({
        property_name: [prop.property_name || '', Validators.required],
        property_address: [prop.property_address || '', Validators.required],
        current_value: [prop.current_value || '', Validators.required],
        equity: [{ value: prop.equity || '', disabled: true }, Validators.required],

        // Mortgage
        financed_amount: [prop.financed_amount || '', isRequired ? Validators.required : []], //new
        current_loan_balance: [{ value: prop.current_loan_balance || '', disabled: true }, isRequired ? Validators.required : []], //new
        monthly_payment: [{ value: prop.monthly_payment || '', disabled: true }, isRequired ? Validators.required : []], //new
        loan_start_date: [this.formatDate(prop.loan_start_date) || '', isRequired ? Validators.required : []],
        loan_tenure: [prop.loan_tenure || '', isRequired ? Validators.required : []],
        interest_rate: [prop.interest_rate || '', isRequired ? Validators.required : []],
        notes: [prop.notes || ''],

        // HELOC
        heloc_percent: [prop.heloc_percent || '65.00', showHelocFields ? Validators.required : []],
        heloc_amount: [{ value: prop.heloc_amount || '', disabled: true }, showHelocFields ? Validators.required : []],
        heloc_current_debt_balance: [prop.heloc_current_debt_balance || '', showHelocFields ? Validators.required : []],
        heloc_room_abvailable: [{ value: prop.heloc_room_abvailable || '', disabled: true }, showHelocFields ? Validators.required : []],

        heloc_interest_rate: [prop.heloc_interest_rate || '', showHelocFields ? Validators.required : []],
        heloc_monthly_payment: [{ value: prop.heloc_monthly_payment || '', disabled: true }, showHelocFields ? Validators.required : []],
        //credit_available: [prop.credit_available || '', showHelocFields ? Validators.required : []],

        // Monthly Expenses
        monthly_mortgage_insurance_expense: [prop.monthly_mortgage_insurance_expense || '', Validators.required],
        monthly_mortgage_extra_expense: [prop.monthly_mortgage_extra_expense || '', Validators.required],
        monthly_property_tax_expense: [prop.monthly_property_tax_expense || '', Validators.required],
        monthly_property_insurance_expense: [prop.monthly_property_insurance_expense || '', Validators.required],
        monthly_utility_expense: [prop.monthly_utility_expense || '', Validators.required],
        community_condo_fees_expense: [prop.community_condo_fees_expense || '', Validators.required],
        // extra_payment_made: [prop.extra_payment_made || '', Validators.required]
      });

      // Attach value change subscriptions for auto-calculation
      group.get('current_value')?.valueChanges.subscribe(() => this.calculateHelocFields(group));
      group.get('interest_rate')?.valueChanges.subscribe(() => this.calculateHelocFields(group));
      group.get('heloc_room_abvailable')?.valueChanges.subscribe(() => this.calculateHelocFields(group));
      group.get('heloc_percent')?.valueChanges.subscribe(() => this.calculateHelocFields(group));

      this.properties.push(group);

      ['financed_amount', 'interest_rate', 'loan_tenure', 'loan_start_date'].forEach(field => {
        group.get(field)?.valueChanges.subscribe(() => {
          this.calculateLoanFields(group);
        });
      });

      group.get('heloc_current_debt_balance')?.setValidators([
        Validators.required,
        this.helocDebtLimitValidator(group)
      ]);

    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Outputs YYYY-MM-DD
  }


  get properties(): FormArray {
    return this.form.get('properties') as FormArray;
  }

  addProperty(): void {

    const isRequired = this.selectedCaseType !== '3';
    const showHelocFields = this.selectedCaseType !== '1' && this.selectedCaseType !== '3';
    //const showMonthlyExpenses = this.selectedCaseType !== '1';

    const group = this.fb.group({
      property_name: ['', Validators.required],
      property_address: ['', Validators.required],
      current_value: ['', Validators.required],
      equity: [{ value: '', disabled: true }, Validators.required],

      financed_amount: ['', isRequired ? Validators.required : []], //new
      current_loan_balance: [{ value: '', disabled: true }, isRequired ? Validators.required : []], //new
      monthly_payment: [{ value: '', disabled: true }, isRequired ? Validators.required : []], //new
      loan_start_date: ['', isRequired ? Validators.required : []],
      loan_tenure: ['6', isRequired ? Validators.required : []],
      interest_rate: ['', isRequired ? Validators.required : []],
      notes: [''],

      // HELOC (conditionally shown)
      heloc_percent: ['65.00', showHelocFields ? Validators.required : []],
      heloc_amount: [{ value: '', disabled: true }, showHelocFields ? Validators.required : []],
      heloc_current_debt_balance: ['0', showHelocFields ? Validators.required : []],
      heloc_room_abvailable: [{ value: '', disabled: true }, showHelocFields ? Validators.required : []],

      heloc_interest_rate: ['', showHelocFields ? Validators.required : []],
      heloc_monthly_payment: [{ value: '', disabled: true }, showHelocFields ? Validators.required : []],
      //credit_available: ['', showHelocFields ? Validators.required : []],

      // Monthly Expenses (conditionally shown)
      monthly_mortgage_insurance_expense: ['', Validators.required],
      monthly_mortgage_extra_expense: ['', Validators.required],
      monthly_property_tax_expense: ['', Validators.required],
      monthly_property_insurance_expense: ['', Validators.required],
      monthly_utility_expense: ['', Validators.required],
      community_condo_fees_expense: ['', Validators.required],
      // extra_payment_made: ['', Validators.required]
    });



    // Subscribe for calculation
    group.get('current_value')?.valueChanges.subscribe(() => this.calculateHelocFields(group));
    group.get('interest_rate')?.valueChanges.subscribe(() => this.calculateHelocFields(group));
    group.get('heloc_room_abvailable')?.valueChanges.subscribe(() => this.calculateHelocFields(group));
    group.get('heloc_percent')?.valueChanges.subscribe(() => this.calculateHelocFields(group));

    this.properties.push(group);

    group.get('heloc_current_debt_balance')?.setValidators([
      Validators.required,
      this.helocDebtLimitValidator(group)
    ]);

    ['financed_amount', 'interest_rate', 'loan_tenure', 'loan_start_date'].forEach(field => {
      group.get(field)?.valueChanges.subscribe(() => {
        this.calculateLoanFields(group);
      });
    });

  }

  updateHelocPayment(group: any): void {
    const heloc_current_debt_balance = parseFloat(group.get('heloc_current_debt_balance')?.value) || 0;
    const heloc_interest_rate = parseFloat(group.get('heloc_interest_rate')?.value) || 0;

    const monthlyRate = (heloc_current_debt_balance * heloc_interest_rate / 100) / 12;

    group.get('heloc_monthly_payment')?.setValue(monthlyRate.toFixed(2), { emitEvent: false });
  }

  calculateHelocFields(group: FormGroup) {
    const currentValue = parseFloat(group.get('current_value')?.value) || 0;
    const loanPercent = parseFloat(group.get('heloc_percent')?.value) || 0; // 65 or 80
    const currentLoanBalance = parseFloat(group.get('current_loan_balance')?.value) || 0;
    const heloc_current_debt_balance = parseFloat(group.get('heloc_current_debt_balance')?.value) || 0;

    // 1. Calculate HELOC Amount
    const helocAmount = currentValue * (loanPercent / 100);
    group.get('heloc_amount')?.setValue(helocAmount.toFixed(2), { emitEvent: false });

    // 2. Calculate HELOC Room
    //const helocRoom = helocAmount - currentLoanBalance;
    const helocRoom = helocAmount - currentLoanBalance - heloc_current_debt_balance;
    group.get('heloc_room_abvailable')?.setValue(helocRoom.toFixed(2), { emitEvent: false });
  }


  calculateCurrentEquity(group: any) {
    this.calculateHelocFields(group);
    this.updateHelocPayment(group);
    const current_value = parseFloat(group.get('current_value')?.value) || 0;
    const current_loan_balance = parseFloat(group.get('current_loan_balance')?.value) || 0;
    const heloc_current_debt_balance = parseFloat(group.get('heloc_current_debt_balance')?.value) || 0;

    const equity = current_value - current_loan_balance - heloc_current_debt_balance;

    group.get('equity')?.setValue(equity.toFixed(2), { emitEvent: false });
    //group.get('projected_amount')?.setValue(projection.toFixed(2), { emitEvent: false });
  }

  calculateLoanFields(group: any) {
    const principal = parseFloat(group.get('financed_amount')?.value) || 0;
    const annualRate = parseFloat(group.get('interest_rate')?.value) || 0;
    const tenure = parseInt(group.get('loan_tenure')?.value) || 0;
    const startDate = new Date(group.get('loan_start_date')?.value);

    if (principal <= 0 || annualRate <= 0 || tenure <= 0 || isNaN(startDate.getTime())) {
      return;
    }

    const monthlyRate = annualRate / 12 / 100;

    // Calculate EMI
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure);
    const denominator = Math.pow(1 + monthlyRate, tenure) - 1;
    const monthlyPayment = numerator / denominator;

    // Calculate how many months have passed
    const today = new Date();
    const monthsPassed =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth());

    // Remaining balance after X months (Amortization)
    let remainingBalance = 0;
    if (monthsPassed < tenure) {
      const balanceNumerator = Math.pow(1 + monthlyRate, tenure) - Math.pow(1 + monthlyRate, monthsPassed);
      const balanceDenominator = Math.pow(1 + monthlyRate, tenure) - 1;
      remainingBalance = principal * balanceNumerator / balanceDenominator;
    }

    group.get('monthly_payment')?.setValue(monthlyPayment.toFixed(2), { emitEvent: false });
    group.get('current_loan_balance')?.setValue(remainingBalance.toFixed(2), { emitEvent: false });
  }


  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return
    }
    const payload = {
      case_id: this.client_case_id,
      completed_step: 'client_property',
      properties: this.form.getRawValue().properties
    };
    this.loading = true;
    this.service.postData('create-client-property', payload).subscribe({
      next: (resp) => {
        this.router.navigateByUrl('/user/loan-calculator/credit-details');
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error(err)
      }
    });
  }

  removeProperty(index: number): void {
    this.properties.removeAt(index);
  }

  helocDebtLimitValidator(group: FormGroup): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const helocDebt = parseFloat(control.value) || 0;
      const helocAmount = parseFloat(group.get('heloc_amount')?.value) || 0;

      return helocDebt > helocAmount
        ? { helocDebtExceedsLimit: true }
        : null;
    };
  }


}
