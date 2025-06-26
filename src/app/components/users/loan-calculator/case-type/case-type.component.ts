import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { AuthService } from '../../../../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-case-type',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './case-type.component.html',
  styleUrl: './case-type.component.css'
})
export class CaseTypeComponent {

  selectedCaseType: any = '';
  caseName: any;
  name: any;
  clientId: any;
  client_case_id: any;
  loading: boolean = false;

  constructor(private router: Router, private sharedService: SharedService, private authService: AuthService, private toastr: NzMessageService) { }

  ngOnInit() {
    this.client_case_id = sessionStorage.getItem('client_case_id');
    this.caseName = sessionStorage.getItem('selectedCaseName');
    this.name = sessionStorage.getItem('selectedClientName');
    this.selectedCaseType = sessionStorage.getItem('selectedCaseType');
    this.clientId = this.authService.getAgentId();
    //this.getAllAgents();
  }

  getAllAgents() {
    this.sharedService.getApi(`get-all-case-types`).subscribe({
      next: (resp: any) => {
        this.caseOptions = resp.data;
      },
      error: error => {
        //this.agentsList = []
        console.log(error.message);
      }
    });
  }

  caseOptions = [
    {
      id: '1',
      value: 'mortgage',
      title: 'Mortgage',
      description: 'A property with a mortgage',
      svg: `assets/img/mortage.png`
    },
    {
      id: '2',
      value: 'mortgage_heloc',
      title: 'Mortgage + HELOC',
      description: 'Mortgage plus a HELOC',
      svg: `assets/img/heloc.png`
    },
    {
      id: '3',
      value: 'no_mortgage',
      title: 'Property, No Mortgage',
      description: 'Fully owned property',
      svg: `assets/img/prop.png`
    },
    {
      id: '4',
      value: 'no_property',
      title: 'No Property',
      description: 'Renting or no real estate',
      svg: `assets/img/mortage.png`
    }
  ];

  selectCase(value: string): void {
    this.selectedCaseType = value;
  }

  submitCase(): void {
    if (this.selectedCaseType == '') {
      this.toastr.error('Please select case type.');
      return
    }
    sessionStorage.setItem('selectedCaseType', this.selectedCaseType);

    this.loading = true;

    const formURlData = new URLSearchParams();
    formURlData.append('client_id', this.clientId);
    formURlData.append('case_type_id', this.selectedCaseType);
    formURlData.append('case_name', this.caseName);
    formURlData.append('full_name', this.name);
    formURlData.append('completed_step', 'client_case');
    if (this.client_case_id) {
      formURlData.append('client_case_id', this.client_case_id);
    }

    //formURlData.append('agent_id', this.clientId);

    this.sharedService.postAPI(`create-client-case`, formURlData).subscribe({
      next: (resp: any) => {
        this.client_case_id = resp.client_case_id;
        sessionStorage.setItem('client_case_id', this.client_case_id);
        this.router.navigate(['/user/loan-calculator/people-details']);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
