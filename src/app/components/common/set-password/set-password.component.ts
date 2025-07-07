import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../services/shared.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css'
})
export class SetPasswordComponent {


  form!: FormGroup;
  passwordMismatch = false;
  loading: boolean = false;
  userRole: any;
  id: any;
  isPasswordVisible2: boolean = false;
  isPasswordVisible3: boolean = false;

  constructor(private service: SharedService, private toastr: NzMessageService,
    private router: ActivatedRoute, private route: Router, private authService: AuthService) { }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    this.initForm();
    this.userRole = this.authService.getUserRole();
  }

  initForm() {
    this.form = new FormGroup({
      new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm_password: new FormControl('', Validators.required),
    });
    //, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    this.form.get('confirm_password')?.setValidators([
      Validators.required,
      this.passwordMatchValidator()
    ]);
  }

  submitForm() {
    this.form.markAllAsTouched();

    const newPassword = this.form.value.new_password?.trim();

    if (!newPassword) {
      //this.toastr.warning('Passwords cannot be empty or just spaces.');
      return;
    }

    if (this.form.valid && !this.passwordMismatch) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('password', this.form.value.new_password);
      formURlData.set('id', this.id);
      this.service.postAPI('set-new-password', formURlData).subscribe({
        next: (resp) => {
          if (resp.success) {
            if (this.userRole == 'Agent') {
              this.route.navigateByUrl("/agent/agent-dashboard");
            } else if (this.userRole == 'Client') {
              this.route.navigateByUrl("/user/user-dashboard");
            }
            this.toastr.success(resp.message);
            console.log(resp.message)
            this.form.reset();
            this.loading = false;
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          this.loading = false;
          //this.toastr.warning('Old password is incorrect.');
          console.error('Login error:', error.message);
        }
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.form.get('new_password')?.value;
      const confirmPassword = control.value;
      if (password !== confirmPassword) {
        this.passwordMismatch = true;
        return { passwordMismatch: true };
      } else {
        this.passwordMismatch = false;
        return null;
      }
    };
  }


  togglePasswordVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }


  togglePasswordVisibility3() {
    this.isPasswordVisible3 = !this.isPasswordVisible3;
  }

}
