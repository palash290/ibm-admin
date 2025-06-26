import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent {

  profileForm!: FormGroup;
  loading: boolean = false;
  searchQuery: any = '';
  clientsList: any;
  p: any = 1;
  status: any = '';
  userRole: any;
  agentId: any;
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  constructor(private service: SharedService, private toastr: NzMessageService, private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.agentId = this.authService.getAgentId();
    this.initForm();
    if (this.userRole == 'Admin' || this.userRole == 'Sub Admin') {
      this.getAllClients();
    } else {
      this.getAllClientsByAgentId();
    }
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }


  getAllClients() {
    this.p = 1;
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('role_id', '4');
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);

    this.service.postAPI(`get-users-by-role`, formURlData).subscribe({
      next: (resp: any) => {
        this.clientsList = resp.users.reverse();
      },
      error: error => {
        this.clientsList = []
        console.log(error.message);
      }
    });
  }

  getAllClientsByAgentId() {
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('agent_id', this.agentId);
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);

    this.service.postAPI(`get-clients-by-agent-id`, formURlData).subscribe({
      next: (resp: any) => {
        this.clientsList = resp.users;
      },
      error: error => {
        this.clientsList = []
        console.log(error.message);
      }
    });
  }

  addClient() {
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
      formURlData.append('role_id', '4');
      formURlData.append('agent_id', this.agentId);

      this.service.postAPI('create-user-by-role', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModal1.nativeElement.click();
            if (this.userRole == 'Admin' || this.userRole == 'Sub Admin') {
              this.getAllClients();
            } else {
              this.getAllClientsByAgentId();
            }
            this.profileForm.reset();
          } else {
            this.toastr.warning(resp.message);
            this.loading = false;
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

  handleCheckboxChange(row: any) {
    if (row.status == 2) {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to unblock this client!",
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
          // formURlData.set('role', 'seller');
          formURlData.set('status', '1');
          this.service.postAPI(`block-unblock-user`, formURlData).subscribe({
            next: resp => {
              this.toastr.success(resp.message);
              if (this.userRole == 'Admin' || this.userRole == 'Sub Admin') {
                this.getAllClients();
              } else {
                this.getAllClientsByAgentId();
              }
            }
          })
        } else {
          //this.toastr.warning('Something went wrong!');
          if (this.userRole == 'Admin' || this.userRole == 'Sub Admin') {
            this.getAllClients();
          } else {
            this.getAllClientsByAgentId();
          }
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to block this client!",
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
              if (this.userRole == 'Admin' || this.userRole == 'Sub Admin') {
                this.getAllClients();
              } else {
                this.getAllClientsByAgentId();
              }
            }
          })
        } else {
          //this.toastr.warning('Something went wrong!');
          if (this.userRole == 'Admin' || this.userRole == 'Sub Admin') {
            this.getAllClients();
          } else {
            this.getAllClientsByAgentId();
          }
        }
      });
    }
  }

  userImg1: any;

  showImg(url: any) {
    this.userImg1 = url;
  }


}
