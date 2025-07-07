import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-combined-policies',
  standalone: true,
  imports: [RouterLink, FormsModule, ReactiveFormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './combined-policies.component.html',
  styleUrl: './combined-policies.component.css'
})
export class CombinedPoliciesComponent {


  combineData: any[] = [];
  client_case_id: any;
  // p: any = 1;

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id');
    this.getPeoplesDetails();
  }

  getPeoplesDetails() {
    //this.p = 1;
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`get-combined-policy`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.combineData = resp.data;
        }
      }
    });
  }

  downloadCSV(): void {
    if (!this.combineData || this.combineData.length === 0) {
      console.warn('No data to export');
      return;
    }

    const header = [
      'Year | Age', 'Base Premium', 'EDO', 'Total Premium',
      'Annual Increase', 'Annual Increase in Total Cash Value',
      'Total Cash Value', 'Death Benefit'
    ];

    const rows = this.combineData.map((item: any, index: number) => [
      `${item.year} | ${item.age}`,
      `$${item.total_guaranteed_premium}`,
      `$${item.total_deposit}`,
      `$${item.total_cash_premiums}`,
      `$${item.total_dividend}`,
      `$${item.total_cash_increase}`,
      `$${item.total_cash}`,
      `$${item.total_death}`
    ]);

    const csvContent = [
      header.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'combined_policies.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


}
