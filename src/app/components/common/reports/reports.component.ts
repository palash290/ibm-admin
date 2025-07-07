import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

  userRole: any;
  p: any = 1;
  searchQuery: any = '';
  status: any = '';
  caseList: any;

  constructor(private authService: AuthService, private sharedService: SharedService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.getSingleClientCases();
  }


  getSingleClientCases() {
    this.p = 1;
    const trimmedSearch = this.searchQuery?.trim() || '';

    const formURlData = new URLSearchParams();
    formURlData.append('search', trimmedSearch);
    formURlData.append('status', this.status);

    this.sharedService.postAPI('get-all-cases-of-clients', formURlData).subscribe({
      next: (resp: any) => {
        this.caseList = resp.data;
      },
      error: error => {
        this.caseList = [];
        console.log(error.message);
      }
    });
  }


}
