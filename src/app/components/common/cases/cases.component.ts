import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './cases.component.html',
  styleUrl: './cases.component.css'
})
export class CasesComponent {

  caseList: any;
  userId: any;
  p: any = 1;
  searchQuery: any = '';
  status: any = '';
  userRole: any;

  constructor(private authService: AuthService, private sharedService: SharedService, private router: Router, private toastr: NzMessageService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.userId = this.authService.getAgentId();
    //if (this.userRole == 'Client') {
    this.getSingleClientCases();
    // }
    // if (this.userRole == 'Agent') {
    //   this.getAgentCases();
    // }

  }

  getSingleClientCases() {
    this.p = 1;
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);
    if (this.userRole == 'Client') {
      formURlData.append('client_id', this.userId);
    } else {
      formURlData.append('agent_id', this.userId);
    }


    const apiEndpoint = this.userRole == 'Client' ? 'get-client-all-cases' : 'get-all-cases-of-agent';

    this.sharedService.postAPI(apiEndpoint, formURlData).subscribe({
      next: (resp: any) => {
        this.caseList = resp.data;
      },
      error: error => {
        this.caseList = [];
        console.log(error.message);
      }
    });
  }

  goToForm(completed_step: any, caseId: any) {
    if (completed_step == 'client_loan') {
      this.router.navigateByUrl('/user/loan-calculator/loan-details');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_property') {
      this.router.navigateByUrl('/user/loan-calculator/property-details');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_people') {
      this.router.navigateByUrl('/user/loan-calculator/people-details');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_credit') {
      this.router.navigateByUrl('/user/loan-calculator/credit-details');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_loan') {
      this.router.navigateByUrl('/user/loan-calculator/loan-details');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_investment') {
      this.router.navigateByUrl('/user/loan-calculator/investment');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_expenses') {
      this.router.navigateByUrl('/user/loan-calculator/monthly-expenses');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_totals') {
      this.router.navigateByUrl('/user/loan-calculator/totals');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_reduction') {
      this.router.navigateByUrl('/user/loan-calculator/expense-reduction');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_final_totals') {
      this.router.navigateByUrl('/user/loan-calculator/final-totals');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_case') {
      this.router.navigateByUrl('/user/loan-calculator/case-type');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'client_policies') {
      this.router.navigateByUrl('/user/loan-calculator/policies');
      sessionStorage.setItem('client_case_id', caseId);
    } else if (completed_step == 'final_report_completed') {
      this.router.navigateByUrl('/user/final-report');
      sessionStorage.setItem('client_case_id', caseId);
    }
  }

  caseId: any;
  @ViewChild('closeModalDelete') closeModalDelete!: ElementRef;

  getId(id: any) {
    this.caseId = id;
  }

  deleteAgent() {
    const formURlData = new URLSearchParams();
    formURlData.set('case_id', this.caseId);

    this.sharedService.postAPI(`delete-client-case`, formURlData).subscribe({
      next: (resp: any) => {
        this.getSingleClientCases();
        this.closeModalDelete.nativeElement.click();
        this.toastr.success('Agent deleted successfully!');
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


}
