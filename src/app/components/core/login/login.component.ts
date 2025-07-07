import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isPasswordVisible: boolean = false;
  loginForm!: FormGroup;
  loading: boolean = false;
  subAdminPermission: any;
  subAdminPermissionNames: any[] = [];


  constructor(private route: Router, private apiService: SharedService, private authService: AuthService, private toastr: NzMessageService) {
    if (this.apiService.isLogedIn()) {
      this.route.navigate(['/admin/admin-dashboard']);
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
      this.apiService.postAPI('login', formURlData.toString()).subscribe({
        next: (resp: any) => {
          if (resp.success == true) {
            this.authService.setUserRole(resp.user.role_name)
            this.apiService.setToken(resp.token);
            this.toastr.success(resp.message);

            this.authService.setAgentId(resp.user.id);
            this.subAdminPermission = resp.user.permissions;
            this.subAdminPermissionNames = resp.user?.permissions?.map((p: any) => p.name) || [];
            localStorage.setItem('subAdminPermissions', JSON.stringify(this.subAdminPermissionNames));


            if (resp.user.role_name == 'Admin' || resp.user.role_name == 'Sub Admin') {
              this.route.navigateByUrl("/admin/admin-dashboard");
            } else if (resp.user.role_name == 'Agent' && resp.user.status == '0') {
              this.route.navigate(['/set-password'], { queryParams: { id: resp.user.id } });
            } else if (resp.user.role_name == 'Agent' && resp.user.status == '1') {
              this.route.navigateByUrl("/agent/agent-dashboard");
            } else if (resp.user.role_name == 'Client' && resp.user.status == '0') {
              this.route.navigate(['/set-password'], { queryParams: { id: resp.user.id } });
            } else if (resp.user.role_name == 'Client' && resp.user.status == '1') {
              this.route.navigateByUrl("/user/user-dashboard");
            }
            this.loading = false;

            // if (resp.user.role_name == 'Client') {
            //   this.route.navigateByUrl("/user/dashboard");
            // }
            // if (resp.user.role_name == 'SubAdmin') {
            //   this.route.navigateByUrl("/admin/dashboard");
            // }

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
