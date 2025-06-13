import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  resetForm!: FormGroup
  loading: boolean = false

  constructor(
    private route: Router,
    private srevice: SharedService,
    private toastr: NzMessageService
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  onSubmit() {
    this.resetForm.markAllAsTouched()
    if (this.resetForm.valid) {
      this.loading = true
      const formURlData = new URLSearchParams()
      formURlData.set('email', this.resetForm.value.email)
      this.srevice
        .postAPI('forgot-password', formURlData.toString())
        .subscribe({
          next: (resp: any) => {
            if (resp.success == true) {
              this.loading = false
              this.toastr.success(resp.message)
              this.resetForm.reset()
              this.route.navigateByUrl('/')
            } else {
              this.loading = false
              this.toastr.warning(resp.message)
            }
            console.log(resp)
          },
          error: (error: any) => {
            this.loading = false
            if (error.error.message) {
              this.toastr.error(error.error.message);
            } else {
              this.toastr.error('Something went wrong!');
            }
          }
        })
    }
  }

  
}
