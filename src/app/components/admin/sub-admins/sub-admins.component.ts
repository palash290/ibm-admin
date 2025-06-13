import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-admins',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './sub-admins.component.html',
  styleUrl: './sub-admins.component.css'
})
export class SubAdminsComponent {

  profileForm!: FormGroup;
  loading: boolean = false;
  subAdminList: any;
  searchQuery: any = '';
  p: any = 1;
  status: any = '';
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  constructor(private service: SharedService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.initForm();
    this.getAllSubAdmins();
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  getAllSubAdmins() {
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('role_id', '2');
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);

    this.service.postAPI(`get-users-by-role`, formURlData).subscribe({
      next: (resp: any) => {
        this.subAdminList = resp.users;
      },
      error: error => {
        this.subAdminList = []
        console.log(error.message);
      }
    });
  }

  addSubAdmin() {
    this.profileForm.markAllAsTouched();

    const name = this.profileForm.value.name?.trim();
    const email = this.profileForm.value.email?.trim();

    if (!name || !email) {
      return;
    }

    if (this.profileForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.append('name', this.profileForm.value.name);
      formURlData.append('email', this.profileForm.value.email);
      formURlData.append('role_id', '2');

      this.service.postAPI('create-user-by-role', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModal1.nativeElement.click();
            this.getAllSubAdmins();
            this.profileForm.reset();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
          }
        },
        error: (error) => {
          const message = error?.error?.message || 'Something went wrong.';
          this.toastr.error(message);
          this.loading = false;
        }
      });
    } else {
      //this.loading = false;
      this.toastr.warning('Please check all the fields!');
    }
  }


  handleCheckboxChange(row: any) {
    if (row.status == 2) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to unblock this sub admin!",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('id', row.id);
          //formURlData.set('role', 'seller');
          formURlData.set('status', '1');
          this.service.postAPI(`block-unblock-user`, formURlData).subscribe({
            next: resp => {
              this.toastr.success(resp.message);
              this.getAllSubAdmins();
            }
          })
        } else {
          //this.toastr.warning('Something went wrong!');
          this.getAllSubAdmins();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to block this sub admin!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('id', row.id);
          // formURlData.set('role', 'seller');
          formURlData.set('status', '2');
          this.service.postAPI(`block-unblock-user`, formURlData).subscribe({
            next: resp => {
              this.toastr.success(resp.message);
              this.getAllSubAdmins();
            }
          })
        } else {
          //this.toastr.warning('Something went wrong!');
          this.getAllSubAdmins();
        }
      });
    }
  }

  subId: any;

  getId(id: any) {
    this.subId = id;
  }


  deleteAgent() {
    const formURlData = new URLSearchParams();
    formURlData.set('id', this.subId);

    this.service.postAPI(`delete-user`, formURlData).subscribe({
      next: (resp: any) => {
        this.subAdminList = resp.users;
        this.getAllSubAdmins();
        this.closeModalDelete.nativeElement.click();
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  userImg1: any;

  showImg(url: any) {
    this.userImg1 = url;
  }


}
