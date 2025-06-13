import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.css'
})
export class AgentsComponent {

  profileForm!: FormGroup;
  loading: boolean = false;
  searchQuery: any = '';
  searchQueryModal: any = '';
  agentsList: any;
  agentsListModal: any;
  p: any = 1;
  status: any = '';
  userRole: any;
  singleAgentId: any;
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  constructor(private service: SharedService, private toastr: NzMessageService, private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.initForm();
    this.getAllAgents();
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }


  getAllAgents() {
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('role_id', '3');
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);

    this.service.postAPI(`get-users-by-role`, formURlData).subscribe({
      next: (resp: any) => {
        this.agentsList = resp.users;
      },
      error: error => {
        this.agentsList = [];
        console.log(error.message);
      }
    });
  }

  getModalAgents(id: any) {
    this.singleAgentId = id;
    const trimmedSearch = this.searchQueryModal?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('role_id', '3');
    formURlData.append('search', trimmedSearch);

    this.service.postAPI(`get-users-by-role`, formURlData).subscribe({
      next: (resp: any) => {
        // Remove the object with matching id
        this.agentsListModal = (resp.users || []).filter((user: any) => user.id !== id);
      },
      error: error => {
        this.agentsListModal = [];
        console.log(error.message);
      }
    });
  }


  addAgent() {
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
      formURlData.append('role_id', '3');

      this.service.postAPI('create-user-by-role', formURlData).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            this.toastr.success(resp.message);
            this.loading = false;
            this.closeModal1.nativeElement.click();
            this.getAllAgents();
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
        text: "You want to unblock this agent!",
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
              this.getAllAgents();
            }
          })
        } else {
          //this.toastr.warning('Something went wrong!');
          this.getAllAgents();
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to block this agent!",
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
              this.getAllAgents();
            }
          })
        } else {
          //this.toastr.warning('Something went wrong!');
          this.getAllAgents();
        }
      });
    }
  }

  agentId: any;

  getId(id: any) {
    this.agentId = id;
  }

  deleteAgent() {
    const formURlData = new URLSearchParams();
    formURlData.set('id', this.agentId);

    this.service.postAPI(`delete-user`, formURlData).subscribe({
      next: (resp: any) => {
        this.agentsList = resp.users;
        this.getAllAgents();
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

  selectedAgentId: number | null = null;

  assignAgent() {
    if (!this.selectedAgentId) {
      alert('Please select an agent to reassign.');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('agent_id', this.selectedAgentId.toString());

    this.service.postAPI('assign-agent', formData).subscribe({
      next: (resp) => {
        console.log('Agent assigned successfully:', resp);
        // Optionally close modal or show a toast
      },
      error: (error) => {
        console.error('Failed to assign agent:', error.message);
        // Optionally show an error message
      }
    });
  }


}
