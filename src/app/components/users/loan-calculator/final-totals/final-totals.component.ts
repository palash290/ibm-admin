import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-final-totals',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './final-totals.component.html',
  styleUrl: './final-totals.component.css'
})
export class FinalTotalsComponent {

  client_case_id: any = '';
  totalCalculations: any;
  loading: boolean = false;
  selectedCaseType: any;
  userRole: any;

  constructor(private service: SharedService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.selectedCaseType = sessionStorage.getItem('selectedCaseType');
    this.client_case_id = sessionStorage.getItem('client_case_id');
    this.getFinalTotals(this.client_case_id);
  }

  getFinalTotals(id: any) {
    const payload = {
      case_id: id
    };
    this.service.postData(`get-client-final-totals`, payload).subscribe({
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
      completed_step: 'client_final_totals',
    };
    this.loading = true;
    this.service.postData(`create-client-final-total`, payload).subscribe({
      next: (resp: any) => {
        this.loading = false;
        if (this.userRole == 'Agent') {
          this.router.navigateByUrl('/user/loan-calculator/policies');
        }
      },
      error: error => {
        this.loading = false;
        console.log(error.message);
      }
    });
  }


}
