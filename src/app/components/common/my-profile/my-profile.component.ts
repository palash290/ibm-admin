import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

  profileForm!: FormGroup;
  userDet: any;
  userEmail: any;
  first_name: any;
  phone: any;
  loading: boolean = false;
  profileImg: string | ArrayBuffer | null = null;
  pattern1 = "^[0-9_-]{8,15}";
    selectedFile!: File;

  constructor(private service: SharedService, private toastr: NzMessageService, private location: Location) { }

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl({ value: this.userEmail, disabled: true })
    });
  }

  loadUserProfile() {
    this.service.getApi('get-profile').subscribe({
      next: (resp) => {
        //debugger
        this.userEmail = resp.user.email;
        this.first_name = resp.user.name;
        this.phone = resp.user.phone_number;
        this.profileImg = resp.user.profile_image;
        this.profileForm.patchValue({
          name: this.first_name,
          phone: this.phone,
          email: this.userEmail
        });

      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  onSubmit() {
    this.profileForm.markAllAsTouched();

    const first_name = this.profileForm.value.name?.trim();
    const phone = this.profileForm.value.phone?.trim();

    if (!first_name || !phone) {
      return;
    }

    if (this.profileForm.valid) {
      this.loading = true;
      const formURlData = new FormData();
      formURlData.append('name', this.profileForm.value.name);
      // formURlData.append('email', this.userEmail);
      formURlData.append('phone_number', this.profileForm.value.phone);

      if (this.selectedFile) {
        formURlData.append('profile_image', this.selectedFile);
      }

      this.service.putAPIFormData('update-profile', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.service.triggerRefresh();
            this.loadUserProfile();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
            this.loadUserProfile();
          }
        },
        error: (error) => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message);
          this.loading = false;
        }
      });
    } else {
      //this.loading = false;
      this.toastr.warning('Please check all the fields!');
    }
  }


  //previewImageAdd: string | ArrayBuffer | null = null;

  // Handle File Upload and Show Preview for Add and Edit Modals
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {

        this.profileImg = reader.result;

      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

    backClicked() {
    this.location.back();
  }


}
