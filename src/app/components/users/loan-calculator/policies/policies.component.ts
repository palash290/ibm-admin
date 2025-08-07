import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import * as Papa from 'papaparse';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent {

  form!: FormGroup;
  client_case_id: any;
  apiPeopleData: any[] = [];

  submitted = false;
  existingFileNames: string[] = [];
  selectedFiles: (File | null)[] = [];
  minDate: any;
  //existingFileNames: any = '';

  constructor(private fb: FormBuilder, private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id');
    this.form = this.fb.group({
      policies: this.fb.array([])
    });

    this.getPeoplePolicies();
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }


  getPeoplesDetails() {
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`get-client-peoples`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          //const peopleData = resp.data.reverse();
          this.apiPeopleData = resp.data.reverse();
          this.apiPeopleData.forEach(() => {
            this.policies.push(this.createPolicyGroup());
          });
        }
      }
    });
  }



  getPeoplePolicies() {
    const formURlData1 = new URLSearchParams();
    formURlData1.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`get-client-people-policies`, formURlData1).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          const policiesData = resp.data;
          this.apiPeopleData = policiesData;
          this.policies.clear();
          this.existingFileNames = []; // clear previous

          policiesData.forEach((policy: any, index: number) => {
            this.policies.push(this.fb.group({
              client_people_id: [parseFloat(policy.client_people_id) || null],
              minimum_recommended_life_coverage: [parseFloat(policy.minimum_recommended_life_coverage) || '', Validators.required],
              insurance_carrier: [policy.insurance_carrier || '', Validators.required],
              policy_interest_rate: [parseFloat(policy.policy_interest_rate) || '', Validators.required],
              policy_start_date: [this.formatDate(policy.policy_start_date) || '', Validators.required],
              actual_policy_start_date: [this.formatDate(policy.actual_policy_start_date) || '', Validators.required],
            }));

            // Fill existing file name if it comes
            this.existingFileNames[index] = policy.policy_file_name || '';
          });
        } else {
          console.log('No policy data found');
        }
      },
      error: (err) => {
        console.log('Policy API failed:', err.message);
        this.getPeoplesDetails();
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Outputs YYYY-MM-DD
  }


  get policies(): FormArray {
    return this.form.get('policies') as FormArray;
  }

  createPolicyGroup(): FormGroup {
    return this.fb.group({
      client_people_id: [null],
      minimum_recommended_life_coverage: ['', Validators.required],
      insurance_carrier: ['', Validators.required],
      policy_interest_rate: ['', Validators.required],
      policy_start_date: ['', Validators.required],
      actual_policy_start_date: ['', Validators.required],
    });
  }


  submit(): void {
    this.submitted = true;

    // File required validation
    const missingFiles = this.policies.value.some((policy: any, i: number) => {
      if (policy.minimum_recommended_life_coverage || policy.insurance_carrier || policy.policy_interest_rate
        || policy.policy_start_date || policy.actual_policy_start_date
      ) {
        return !this.selectedFiles[i] && !this.existingFileNames[i];
      }
      return false;
    });


    if (missingFiles) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      console.warn('Form is invalid');
      return;
    }

    const filledPolicies = this.policies.value
      .map((policy: any, index: number) => {
        return {
          ...policy,
          client_people_id: this.apiPeopleData[index]?.client_people_id,
          case_id: this.client_case_id,
          policy_id: this.apiPeopleData[index]?.policy_id
        };
      })
      .filter((p: { client_people_id: any; minimum_recommended_life_coverage: any; insurance_carrier: any; policy_interest_rate: any; policy_start_date: any; actual_policy_start_date: any }) => p.client_people_id || p.minimum_recommended_life_coverage || p.insurance_carrier || p.policy_interest_rate || p.policy_start_date || p.actual_policy_start_date);

    const payload = {
      case_id: this.client_case_id,
      completed_step: 'client_policies',
      policies: filledPolicies
    };

    console.log('Payload to send:', payload);

    this.sharedService.postData('create-client-people-policy', payload).subscribe({
      next: (resp) => {
        console.log('Saved successfully', resp);
        this.router.navigateByUrl('/user/loan-calculator/combined-policies');
      },
      error: (err) => {
        console.error('Error saving', err);
      }
    });
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    // Keep local for final submit
    this.selectedFiles[index] = file;

    // Immediately upload to API
    const uploadData = new FormData();
    uploadData.append('file', file);
    // uploadData.append('client_people_id', this.apiPeopleData[index]?.client_people_id || '');
    uploadData.append('policy_id', this.apiPeopleData[index]?.policy_id);
    uploadData.append('case_id', this.client_case_id);

    this.sharedService.postAPIFormData('upload-policy-excel', uploadData).subscribe({
      next: (resp) => {
        console.log(`File uploaded for person index ${index}:`, resp);
      },
      error: (err) => {
        console.error(`Error uploading file for person index ${index}:`, err);
        this.selectedFiles[index] = null;
      }
    });
  }


}
