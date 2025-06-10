import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isPasswordVisible: boolean = false;
  loginForm!: FormGroup;
  loading: boolean = false;

  constructor(private route: Router, private apiService: SharedService, private toastr: NzMessageService) {
    if (this.apiService.isLogedIn()) {
      this.route.navigate(['/home/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }

  loginAndFetchData() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.loginForm.value.email);
      formURlData.set('password', this.loginForm.value.password);
      this.apiService.postAPI('loginAdmin', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.route.navigateByUrl("/home/dashboard");
            this.apiService.setToken(resp.data);
            this.toastr.success(resp.message);
            this.loading = false;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          if (error.error.message) {
            this.toastr.error(error.error.message);
          } else {
            this.toastr.error('Something went wrong!');
          }
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
