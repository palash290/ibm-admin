import { Component } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private service: SharedService) { }

  ngOnInit() {
    //this.getBuseSchedule();
  }

  cars: any;
  sellers: any;
  totalBuyers: any;
  totalSellers: any;
  totalActiveCars: any;

  getBuseSchedule() {
    this.service.getApi('getdashboard').subscribe({
      next: (resp: any) => {
        this.totalBuyers = resp.data.totalBuyers;
        this.totalSellers = resp.data.totalSellers;
        this.totalActiveCars = resp.data.totalActiveCars;
        this.cars = resp.data.cars;
        this.sellers = resp.data.sellers?.slice(0, 3);
      },
      error: error => {
        console.log(error.message);
      }
    });
  }


}
