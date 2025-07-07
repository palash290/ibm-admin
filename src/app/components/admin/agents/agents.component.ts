import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
  permissionNames: string[] = [];
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;
  @ViewChild('closeModalAsign') closeModalAsign!: ElementRef;

  clientsList: any[] = [];
  availableUsers: any[] = [];
  selectedUsers: number[] = [];
  selectedAgent: string = '';
  userDropdownOpen = false;
  agentId: any;
  userImg1: any;
  assignments: { [key: string]: any[] } = {};
  @ViewChild('dropdown') dropdownRef!: ElementRef;


  constructor(private service: SharedService, private toastr: NzMessageService, private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.initForm();
    this.getAllAgents();
    const storedPermissions = localStorage.getItem('subAdminPermissions');
    this.permissionNames = storedPermissions ? JSON.parse(storedPermissions) : [];
  }

  hasPermission(name: string): boolean {
    return this.permissionNames.includes(name);
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }


  getAllAgents() {
    this.p = 1;
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('role_id', '3');
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);

    this.service.postAPI(`get-users-by-role`, formURlData).subscribe({
      next: (resp: any) => {
        this.agentsList = resp.users.reverse();
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
        //this.agentsListModal = (resp.users || []).filter((user: any) => user.id !== id);
        // ✅ Keep only users with status == 1 and id != selected id
        this.agentsListModal = (resp.users || []).filter(
          (user: any) => user.status == 1 && user.id !== id
        );

        this.getSingleAgentClients(id);
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
        this.toastr.success('Agent deleted successfully!');
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


  showImg(url: any) {
    this.userImg1 = url;
  }

  // selectedAgentId: number | null = null;

  // assignAgent() {
  //   if (!this.selectedAgentId) {
  //     alert('Please select an agent to reassign.');
  //     return;
  //   }

  //   const formData = new URLSearchParams();
  //   formData.append('agent_id', this.selectedAgentId.toString());

  //   this.service.postAPI('assign-agent', formData).subscribe({
  //     next: (resp) => {
  //       console.log('Agent assigned successfully:', resp);
  //       // Optionally close modal or show a toast
  //     },
  //     error: (error) => {
  //       console.error('Failed to assign agent:', error.message);
  //       // Optionally show an error message
  //     }
  //   });
  // }


  // agents = [
  //   { id: 1, name: 'agent1' },
  //   { id: 2, name: 'agent2' },
  //   { id: 3, name: 'agent3' }
  // ];


  getSingleAgentClients(agentId: any) {
    const formURlData = new URLSearchParams();
    formURlData.set('agent_id', agentId);
    this.service.postAPI(`get-clients-by-agent-id`, formURlData).subscribe({
      next: (resp: any) => {
        this.clientsList = resp.users;
        this.availableUsers = [...this.clientsList];
      },
      error: error => {
        this.availableUsers = [];
        console.log(error.message);
      }
    });
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
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

  getSelectedUserNames(): string {
    if (!this.selectedUsers.length) return 'Select Users';
    const names = this.selectedUsers
      .map(id => this.availableUsers.find(u => u.id === id)?.name)
      .filter(Boolean);
    return names.join(', ');
  }

  assignUsersToAgent(): void {
    if (!this.selectedUsers.length || !this.selectedAgent) return;

    const agentObj = this.agentsList.find((a: any) => a.name === this.selectedAgent);
    if (!agentObj) return;

    const selectedUserObjs = this.availableUsers.filter(user =>
      this.selectedUsers.includes(user.id)
    );

    // Update UI locally
    if (!this.assignments[this.selectedAgent]) {
      this.assignments[this.selectedAgent] = [];
    }
    this.assignments[this.selectedAgent].push(...selectedUserObjs);

    this.availableUsers = this.availableUsers.filter(
      user => !this.selectedUsers.includes(user.id)
    );

    // 🛠 Convert user IDs to comma-separated string
    const payload = {
      agent_id: agentObj.id,
      client_ids: this.selectedUsers.join(',')
    };

    // 🔥 Send API request
    this.service.postData('assign-clients-to-agent', payload).subscribe({
      next: (resp) => {
        this.getAllAgents();
        this.toastr.success(resp.message);
        console.log('Assignment successful:', resp);
        // Optionally show toast
        if (this.availableUsers.length == 0) {
          this.closeModalAsign.nativeElement.click();
        }
      },
      error: (err) => {
        console.error('Assignment failed:', err);
        // Optionally handle UI rollback
      }
    });

    // Reset selections
    this.selectedUsers = [];
    this.selectedAgent = '';
    this.userDropdownOpen = false;
  }


  getAssignedUserNames(agentName: string): string {
    const assignedUsers = this.assignments[agentName] || [];
    return assignedUsers.map(user => user.name).join(', ');
  }

  @HostListener('document:click', ['$event'])

  handleClickOutside(event: MouseEvent) {
    if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.userDropdownOpen = false;
    }
  }


}
