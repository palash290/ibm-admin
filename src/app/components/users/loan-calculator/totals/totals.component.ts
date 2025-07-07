import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './totals.component.html',
  styleUrl: './totals.component.css'
})
export class TotalsComponent {

  client_case_id: any = '';
  totalCalculations: any;
  loading: boolean = false;

  constructor(private service: SharedService, private toastr: NzMessageService, private router: Router) { }

  ngOnInit() {
    this.client_case_id = sessionStorage.getItem('client_case_id');
    this.getSinglePermissions(this.client_case_id);
  }


  getSinglePermissions(id: any) {
    const payload = {
      case_id: id
    };
    this.service.postData(`get-client-totals`, payload).subscribe({
      next: (resp: any) => {
        this.totalCalculations = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  submit(): void {
    const payload = {
      case_id: this.client_case_id,
      completed_step: 'client_totals',
    };
    this.loading = true;
    this.service.postData(`create-client-total`, payload).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.router.navigateByUrl('/user/loan-calculator/expense-reduction');
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
