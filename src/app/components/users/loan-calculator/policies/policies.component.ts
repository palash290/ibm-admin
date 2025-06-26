import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent {

  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      policies: this.fb.array([])
    });

    this.addPolicy(); // Add default
  }

  get policies(): FormArray {
    return this.form.get('policies') as FormArray;
  }

  addPolicy(): void {
    this.policies.push(this.fb.group({
      type: [''],
      carrier: [''],
      interestRate: ['']
    }));
  }

  submit(): void {
    this.router.navigateByUrl('/user/loan-calculator/combined-policies');
    const filledPolicies = this.policies.value.filter((p: any) =>
      p.type || p.carrier || p.interestRate
    );
    console.log('Policies:', filledPolicies);
  }
  
  
}
