import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-investment',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './investment.component.html',
  styleUrl: './investment.component.css'
})
export class InvestmentComponent {

  form: FormGroup;
  client_case_id: any;
  apiinvestmentsData: any[] = [];
  loading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private service: SharedService) {
    this.form = this.fb.group({
      // credits: this.fb.array([]),
      // loans: this.fb.array([]),
      investments: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id');

    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.service.postAPI(`get-client-investments`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.apiinvestmentsData = resp.data.reverse();
          this.populateCredits(this.apiinvestmentsData);
        } else {
          this.apiinvestmentsData = [];
        }
      },
      error: error => {
        this.apiinvestmentsData = [0];
        console.log(error.message);
        this.addInvestment();
      }
    });
  }

  populateCredits(data: any[]): void {
    data.forEach(credit => {
      const group = this.fb.group({
        investment_name: [credit.investment_name || '', Validators.required],
        balance_amount: [credit.balance_amount || '', Validators.required],
        monthly_allotment: [credit.monthly_allotment || '', Validators.required],
        increase_percent: [credit.increase_percent || '', Validators.required],
        projected_amount: [{ value: credit.projected_amount, disabled: true }],
      });

      this.investments.push(group);

          // Attach subscriptions
    group.get('projected_amount')?.valueChanges.subscribe(() => {
      this.updateProjection(group);
    });

    group.get('increase_percent')?.valueChanges.subscribe(() => {
      this.updateProjection(group);
    });

    });
  }

  get investments(): FormArray {
    return this.form.get('investments') as FormArray;
  }

  addInvestment(): void {
    const group = this.fb.group({
      investment_name: ['', Validators.required],
      balance_amount: ['', Validators.required],
      monthly_allotment: ['', Validators.required],
      increase_percent: ['4', Validators.required],
      projected_amount: [{ value: '', disabled: true }],
    });

    this.investments.push(group);
    // Attach subscriptions
    group.get('projected_amount')?.valueChanges.subscribe(() => {
      this.updateProjection(group);
    });

    group.get('increase_percent')?.valueChanges.subscribe(() => {
      this.updateProjection(group);
    });

  }

  removeInvestment(index: number): void {
    this.investments.removeAt(index);
  }


  submit(): void {
    //console.log('Investment Details:', this.form.value.investments);
    // this.router.navigateByUrl('/user/loan-calculator/monthly-expenses')
    // return
    if (this.form.invalid) {
      console.warn('Form is invalid');
      this.form.markAllAsTouched();
      return;
    }
    console.log('investments Details:', this.form.value.investments);

    const payload = {
      case_id: this.client_case_id,
      completed_step: 'client_investment',
      investments: this.form.getRawValue().investments
    };
    this.loading = true;
    this.service.postData(`create-client-investment`, payload).subscribe({
      next: (resp: any) => {
        //this.apiPeopleData = resp.users;
        this.loading = false;
        this.router.navigateByUrl('/user/loan-calculator/monthly-expenses')
      },
      error: error => {
        this.loading = false;
        //this.apiPeopleData = [];
        console.log(error.message);
      }
    });
  }

  getFormControl(group: AbstractControl, controlName: string): FormControl {
    const control = group.get(controlName);
    if (!(control instanceof FormControl)) {
      throw new Error(`Control '${controlName}' is not a FormControl`);
    }
    return control;
  }

  updateProjection(group: FormGroup) {
    const monthly_allotment = parseFloat(group.get('monthly_allotment')?.value) || 0;
    const growthPercent = parseFloat(group.get('increase_percent')?.value) || 0;

    const projectedValue = monthly_allotment + (monthly_allotment * growthPercent / 100);
    group.get('projected_amount')?.setValue(projectedValue.toFixed(2), { emitEvent: false });
  }

  calculateTotalIncome(group: any) {
    const monthly_allotment = parseFloat(group.get('monthly_allotment')?.value) || 0;

    const projectionPercent = (monthly_allotment)*0.04;

    const projected_amount = projectionPercent + monthly_allotment;

    group.get('projected_amount')?.setValue(projected_amount.toFixed(2), { emitEvent: false });
  }


}
