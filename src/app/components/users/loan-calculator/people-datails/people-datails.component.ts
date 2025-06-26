import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-people-datails',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './people-datails.component.html',
  styleUrl: './people-datails.component.css'
})
export class PeopleDatailsComponent {

  form: FormGroup;
  caseType: any;
  apiPeopleData: any[] = [];
  client_case_id: any;
  loading: boolean = false;
  selectedCaseType: any = '';
  //annualIncomeGrowth = 3;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private service: SharedService) {
    this.form = this.fb.group({
      people: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.caseType = this.route.snapshot.queryParamMap.get('caseType');
    this.selectedCaseType = sessionStorage.getItem('selectedCaseType');
    this.client_case_id = sessionStorage.getItem('client_case_id');
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.service.postAPI(`get-client-peoples`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.apiPeopleData = resp.data.reverse();
          this.populatePeople(this.apiPeopleData);
        } else {
          this.apiPeopleData = [];
        }
      },
      error: error => {
        this.apiPeopleData = [0];
        console.log(error.message);
        this.addAdult();
      }
    });

    // if (this.apiPeopleData.length == 0) {
    //   this.addAdult();
    // }


  }

  populatePeople(data: any[]) {
    data.forEach((person: any) => {
      if (person.people_type == 'adult') {
        const group = this.fb.group({
          people_type: ['adult'],
          first_name: [person.first_name, Validators.required],
          last_name: [person.last_name, Validators.required],
          email: [person.email, Validators.required],
          phone_number: [person.phone_number, Validators.required],
          date_of_birth: [this.formatDate(person.date_of_birth), Validators.required],
          monthly_net_income: [person.monthly_net_income, Validators.required],
          monthly_bonuses_dividends: [person.monthly_bonuses_dividends, Validators.required],
          monthly_other_incomes: [person.monthly_other_incomes, Validators.required],
          increase_percent: [person.increase_percent],
          projected_amount: [{ value: person.projected_amount, disabled: true }],
          total_amount: [{ value: person.total_amount, disabled: true }],
          notes: [person.notes]
        });

        this.people.push(group);

        // Attach subscriptions
        group.get('projected_amount')?.valueChanges.subscribe(() => {
          this.updateProjection(group);
        });

        group.get('increase_percent')?.valueChanges.subscribe(() => {
          this.updateProjection(group);
        });

      } else if (person.people_type == 'child') {
        this.people.push(this.fb.group({
          people_type: ['child'],
          first_name: [person.first_name, Validators.required],
          last_name: [person.last_name, Validators.required],
          date_of_birth: [this.formatDate(person.date_of_birth), Validators.required],
          notes: [person.notes]
        }));
      }


    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Outputs YYYY-MM-DD
  }

  getFormControl(group: AbstractControl, controlName: string): FormControl {
    const control = group.get(controlName);
    if (!(control instanceof FormControl)) {
      throw new Error(`Control '${controlName}' is not a FormControl`);
    }
    return control;
  }

  get people(): FormArray {
    return this.form.get('people') as FormArray;
  }

  // addAdult() {
  //   this.people.push(this.fb.group({
  //     people_type: ['adult'],
  //     first_name: ['', Validators.required],
  //     last_name: ['', Validators.required],
  //     email: ['', Validators.required],
  //     phone_number: ['', Validators.required],
  //     date_of_birth: ['', Validators.required],
  //     monthly_net_income: ['', Validators.required],
  //     monthly_bonuses_dividends: ['', Validators.required],
  //     monthly_other_incomes: ['', Validators.required],
  //     increase_percent: ['3'],
  //     projected_amount: [{ value: '', disabled: true }],
  //     total_amount: [{ value: '', disabled: true }],
  //     notes: ['']
  //   }));
  // }
  addAdult() {
    const group = this.fb.group({
      people_type: ['adult'],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      monthly_net_income: ['', Validators.required],
      monthly_bonuses_dividends: ['', Validators.required],
      monthly_other_incomes: ['', Validators.required],
      increase_percent: ['3'],
      projected_amount: [{ value: '', disabled: true }],
      total_amount: [{ value: '', disabled: true }],
      notes: ['']
    });

    this.people.push(group);

    // Attach subscriptions
    group.get('projected_amount')?.valueChanges.subscribe(() => {
      this.updateProjection(group);
    });

    group.get('increase_percent')?.valueChanges.subscribe(() => {
      this.updateProjection(group);
    });
  }


  addChild(): void {
    this.people.push(this.fb.group({
      people_type: ['child'],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      notes: ['']
    }));
  }

  removePerson(index: number): void {
    this.people.removeAt(index);
  }

  submit(): void {
    // this.router.navigateByUrl('/user/loan-calculator/property-details')
    // return
    // debugger
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return
    }
    console.log(this.form.value);
    const payload = {
      case_id: this.client_case_id,
      completed_step: 'client_people',
      peoples: this.form.getRawValue().people
    };
    this.loading = true;

    this.service.postData(`create-client-people`, payload).subscribe({
      next: (resp: any) => {
        //this.apiPeopleData = resp.users;
        if (this.selectedCaseType == '4') {
          this.router.navigateByUrl('/user/loan-calculator/credit-details');
        } else {
          this.router.navigateByUrl('/user/loan-calculator/property-details')
        }
        this.loading = false;
      },
      error: error => {
        this.apiPeopleData = [];
        this.loading = false;
        console.log(error.message);
      }
    });
  }

  calculateTotalIncome(group: any) {
    const monthly_net_income = parseFloat(group.get('monthly_net_income')?.value) || 0;
    const monthly_bonuses_dividends = parseFloat(group.get('monthly_bonuses_dividends')?.value) || 0;
    const monthly_other_incomes = parseFloat(group.get('monthly_other_incomes')?.value) || 0;


    const total_income = monthly_net_income + monthly_bonuses_dividends + monthly_other_incomes;
    const projectionPercent = (monthly_net_income + monthly_bonuses_dividends + monthly_other_incomes) * 0.03;
    const projection = total_income + projectionPercent;

    group.get('total_amount')?.setValue(total_income.toFixed(2), { emitEvent: false });
    group.get('projected_amount')?.setValue(projection.toFixed(2), { emitEvent: false });
  }

  updateProjection(group: FormGroup) {
    const totalIncome = parseFloat(group.get('total_amount')?.value) || 0;
    const growthPercent = parseFloat(group.get('increase_percent')?.value) || 0;

    const projectedValue = totalIncome + (totalIncome * growthPercent / 100);
    group.get('projected_amount')?.setValue(projectedValue.toFixed(2), { emitEvent: false });
  }


}
