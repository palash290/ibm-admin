import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-credit-datails',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './credit-datails.component.html',
  styleUrl: './credit-datails.component.css'
})
export class CreditDatailsComponent {

  form: FormGroup;
  client_case_id: any;
  apiCreditData: any[] = [];
  loading: boolean = false;
  selectedCaseType: any = '';

  constructor(private fb: FormBuilder, private router: Router, private service: SharedService, private toastr: NzMessageService) {
    this.form = this.fb.group({
      credits: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id');
    this.selectedCaseType = sessionStorage.getItem('selectedCaseType');
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.service.postAPI(`get-client-credits`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.apiCreditData = resp.data.reverse();
          this.populateCredits(this.apiCreditData);
        } else {
          this.apiCreditData = [];
        }
      },
      error: error => {
        this.apiCreditData = [0];
        console.log(error.message);
        this.addCredit();
      }
    });

    // if (this.apiCreditData.length == 0) {
    //   this.addCredit();
    // }
  }

  populateCredits(data: any[]): void {
    data.forEach(credit => {
      this.credits.push(this.fb.group({
        credit_type: [credit.credit_type || '', Validators.required],
        credit_limit: [credit.credit_limit || '', Validators.required],
        balance: [credit.balance || '', Validators.required],
        interest_rate: [credit.interest_rate || '', Validators.required],
        monthly_payment: [{ value: credit.monthly_payment || '', disabled: true }, Validators.required],
        terms: [credit.terms || '', Validators.required],
        total_payable_amount: [{ value: credit.total_payable_amount || '', disabled: true }],
        other_credit: [credit.other_credit] // <-- new field
      }));
    });
  }


  get credits(): FormArray {
    return this.form.get('credits') as FormArray;
  }

  addCredit(): void {
    const creditGroup = this.fb.group({
      credit_type: ['', Validators.required],
      credit_limit: ['', Validators.required],
      balance: ['', Validators.required],
      interest_rate: ['', Validators.required],
      monthly_payment: [{ value: '', disabled: true }, Validators.required],
      terms: ['6', Validators.required],
      total_payable_amount: [{ value: '', disabled: true }],
      other_credit: [''] // <-- new field
    });

    // Watch for credit_type value changes
    // creditGroup.get('credit_type')?.valueChanges.subscribe(value => {
    //   const requiredFields = ['credit_limit', 'balance', 'interest_rate', 'monthly_payment'];
    //   requiredFields.forEach(field => {
    //     const control = creditGroup.get(field);
    //     if (value) {
    //       control?.setValidators([Validators.required]);
    //     } else {
    //       control?.clearValidators();
    //     }
    //     control?.updateValueAndValidity();
    //   });
    // });

    // // Auto-calculate monthly_payment when balance or interest_rate changes
    const balanceControl = creditGroup.get('balance');
    const interestControl = creditGroup.get('interest_rate');
    const creditLimitControl = creditGroup.get('credit_limit');
    const monthlyPaymentControl = creditGroup.get('monthly_payment');
    const monthlyTerms = creditGroup.get('terms');

    // Combine value changes
    balanceControl?.valueChanges.subscribe(() => this.updateMonthlyPayment(creditGroup));
    interestControl?.valueChanges.subscribe(() => this.updateMonthlyPayment(creditGroup));
    creditLimitControl?.valueChanges.subscribe(() => this.updateMonthlyPayment(creditGroup));
    monthlyTerms?.valueChanges.subscribe(() => this.updateMonthlyPayment(creditGroup));

    this.credits.push(creditGroup);

    creditGroup.get('credit_type')?.valueChanges.subscribe(value => {
      const customCardControl = creditGroup.get('custom_card_name');

      // if (value === 'other') {
      //   customCardControl?.setValidators([Validators.required]);
      // } else {
      //   customCardControl?.clearValidators();
      //   customCardControl?.setValue('');
      // }

      customCardControl?.updateValueAndValidity();
    });

  }


  updateMonthlyPayment(group: any): void {
    const remainingBalance = parseFloat(group.get('balance')?.value);
    const interestRate = parseFloat(group.get('interest_rate')?.value);
    const creditLimit = parseFloat(group.get('credit_limit')?.value);
    const terms = parseFloat(group.get('terms')?.value); // in months

    if (
      !isNaN(remainingBalance) &&
      !isNaN(interestRate) &&
      !isNaN(creditLimit) &&
      !isNaN(terms) &&
      terms > 0
    ) {
      const usedAmount = creditLimit - remainingBalance;

      const monthlyPrincipal = usedAmount / terms;
      const monthlyInterest = (usedAmount * interestRate) / 12 / 100;

      const monthlyPayment = monthlyPrincipal + monthlyInterest;
      const totalPayble = monthlyPayment * terms

      group.get('monthly_payment')?.setValue(monthlyPayment.toFixed(2), { emitEvent: false });
      group.get('total_payable_amount')?.setValue(totalPayble.toFixed(2), { emitEvent: false });
    } else {
      group.get('monthly_payment')?.setValue('', { emitEvent: false });
      group.get('total_payable_amount')?.setValue('', { emitEvent: false });
    }
  }


  removeCredit(index: number): void {
    this.credits.removeAt(index);
  }

  submit(): void {
    // this.router.navigateByUrl('/user/loan-calculator/loan-details')
    // return

    // if (this.form.value.credit_type == '' || this.form.value.credit_type == undefined) {
    //   this.toastr.warning('Please select a credit type');
    //   return
    // }
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      console.warn('Form is invalid');
      //this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    console.log('Credit Details:', this.form.value.credits);
    const payload = {
      case_id: this.client_case_id,
      completed_step: 'client_credit',
      credits: this.form.getRawValue().credits
    };

    this.service.postData(`create-client-credit`, payload).subscribe({
      next: (resp: any) => {
        //this.apiPeopleData = resp.users;
        this.router.navigateByUrl('/user/loan-calculator/loan-details')
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        //this.apiPeopleData = [];
        console.log(error.message);
      }
    });
  }

  back() {
    if (this.selectedCaseType == '4') {
      this.router.navigateByUrl('/user/loan-calculator/people-details');
    } else {
      this.router.navigateByUrl('/user/loan-calculator/property-details')
    }
  }


}
