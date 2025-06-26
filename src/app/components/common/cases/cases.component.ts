import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

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

  constructor(private authService: AuthService, private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    this.userId = this.authService.getAgentId();
    this.getAllAgents();
  }

  getAllAgents() {
    this.p = 1;
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);
    this.sharedService.postAPI(`get-client-cases`, formURlData).subscribe({
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
    }

  }


}
