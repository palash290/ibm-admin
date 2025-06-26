import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
  @ViewChild('closeModalPremision') closeModalPremision!: ElementRef;

  constructor(private service: SharedService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.initForm();
    this.getAllSubAdmins();
    this.service.getApi(`get-all-permissions`).subscribe({
      next: (resp: any) => {
        this.availableUsers = resp.data.reverse();

        const dashboardPermission = this.availableUsers.find((u: any) => u.name === 'Dashboard');

        // If found and not already selected, add its ID to selectedUsers
        if (dashboardPermission) {
          this.selectedUsers = [dashboardPermission.id];
        }
      },
      error: error => {
        this.availableUsers = [];
        console.log(error.message);
      }
    });
  }


  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  getAllSubAdmins() {
    this.p = 1;
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('role_id', '2');
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);

    this.service.postAPI(`get-users-by-role`, formURlData).subscribe({
      next: (resp: any) => {
        this.subAdminList = resp.users.reverse();
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

    if (this.selectedUsers.length == 0) {
      this.toastr.warning('Please select atleast one permission!')
      return
    }

    if (this.profileForm.valid) {
      this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.append('name', this.profileForm.value.name);
      formURlData.append('email', this.profileForm.value.email);
      formURlData.append('role_id', '2');
      formURlData.append('permission_ids', this.selectedUsers.join(','));


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
        this.toastr.success('Sub admin deleted successfully!');
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


  userDropdownOpen = false;
  selectedUsers: number[] = [];
  availableUsers: any[] = [];

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  getSelectedUserNames(): string {
    if (!this.selectedUsers.length) return 'Select Users';
    const names = this.selectedUsers
      .map(id => this.availableUsers.find(u => u.id === id)?.name)
      .filter(Boolean);
    return names.join(', ');
  }

  isUserSelected(userId: number): boolean {
    return this.selectedUsers.includes(userId);
  }

  toggleUserSelection(userId: number): void {
    if (this.isUserSelected(userId)) {
      this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
    } else {
      this.selectedUsers.push(userId);
    }
  }

  loadPreselectedUsers(id: any): void {
    this.subId = id;
    this.getSinglePermissions(id);
  }

  getSinglePermissions(id: any) {
    const payload = {
      subadmin_id: id
    };
    this.service.postData(`get-sub-admin-permissions`, payload).subscribe({
      next: (resp: any) => {
        // Suppose `resp` is the response you posted above
        const preselectedPermissions = resp.data; // replace with actual response variable
        const preselectedUserIds = preselectedPermissions.map((p: any) => p.id);

        // Filter only if needed
        this.selectedUsers = preselectedUserIds.filter((id: any) =>
          this.availableUsers.some(user => user.id === id)
        );
      },
      error: error => {
        this.selectedUsers = [];
        console.log(error.message);
      }
    });
  }

  getUserNameById(userId: number): string {
    return this.availableUsers.find(user => user.id === userId)?.name || '';
  }

  removeUser(userId: number): void {
    this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.userDropdownOpen = false;
    }
  }

  assignPermission(): void {
    // Your logic here (e.g. API call)

    const payload = {
      subadmin_id: this.subId,
      permission_ids: this.selectedUsers.join(',')
    };

    this.service.postData('set-sub-admin-permissions', payload).subscribe({
      next: (resp) => {
        this.getAllSubAdmins();
        this.toastr.success(resp.message);
        console.log('Assignment successful:', resp);
        // Optionally show toast
        this.closeModalPremision.nativeElement.click();
      },
      error: (err) => {
        console.error('Assignment failed:', err);
        // Optionally handle UI rollback
      }
    });
  }




}
