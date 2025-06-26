import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { AuthService } from '../../../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-case-name',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './case-name.component.html',
  styleUrl: './case-name.component.css'
})
export class CaseNameComponent {

  clientList: any[] = [];
  //selectedClient: any = '';
  agentId: any;
  selectedClientName: any = '';
  selectedClientId: any = '';
  selectedCaseName: any = '';
  userRole: any;
  name: any;
  loading: boolean = false;

  constructor(private service: SharedService, private authService: AuthService, private router: Router, private toastr: NzMessageService) { }

  ngOnInit() {
    this.agentId = this.authService.getAgentId();
    this.userRole = this.authService.getUserRole();

    this.selectedCaseName = sessionStorage.getItem('selectedCaseName');
    if (this.userRole == 'Client') {
      this.selectedClientName = sessionStorage.getItem('selectedClientName');
    }

    if (this.userRole == 'Agent') {
      this.selectedClientId = sessionStorage.getItem('selectedClientId');
    }


    const formURlData = new URLSearchParams();
    formURlData.append('agent_id', this.agentId);

    this.service.postAPI(`get-clients-by-agent-id`, formURlData).subscribe({
      next: (resp: any) => {
        this.clientList = resp.users;

        const defaultClient = this.clientList.find(client => client.id == this.selectedClientId);
        if (defaultClient) {
          this.selectedClientName = defaultClient.name;
          this.selectedClientId = defaultClient.id;
        }

      },
      error: error => {
        this.clientList = []
        console.log(error.message);
      }
    });
  }

  onAgentChange(): void {
    const selected = this.clientList.find(agent => agent.name == this.selectedClientName);
    this.selectedClientId = selected?.id ?? null;
  }

  next() {
    //debugger
    if (this.selectedCaseName == '') {
      this.toastr.error('Please select case name.');
      return
    }
    if (this.userRole == 'Agent' && this.selectedClientId == '') {
      this.toastr.error('Please select client.')
      return
    }
    if (this.userRole == 'Client' && this.selectedClientName == '') {
      this.toastr.error('Please enter your full name.')
      return
    }
    this.loading = true;


    if (this.userRole == 'Client') {
      this.router.navigate(['/user/loan-calculator/case-type']);
      sessionStorage.setItem('selectedCaseName', this.selectedCaseName ? this.selectedCaseName : '');
      sessionStorage.setItem('selectedClientName', this.selectedClientName ? this.selectedClientName : '');
      this.loading = false;
    }

    if (this.userRole == 'Agent') {
      this.router.navigate(['/user/loan-calculator/case-type']);
      sessionStorage.setItem('selectedClientId', this.selectedClientId ? this.selectedClientId : '');
      sessionStorage.setItem('selectedCaseName', this.selectedCaseName ? this.selectedCaseName : '');
      this.loading = false;
    }

  }

}
