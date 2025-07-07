import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { Location } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-view-client',
  standalone: true,
  imports: [RouterLink, CommonModule, NgxPaginationModule],
  templateUrl: './view-client.component.html',
  styleUrl: './view-client.component.css'
})
export class ViewClientComponent {

  p: any = 1;
  clientId: any;
  carFeaturesList: string[] = [];
  clientData: any;
  allCases: any;

  constructor(private service: SharedService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.clientId = this.route.snapshot.queryParamMap.get('id');
    this.getBuseSchedule(this.clientId);
    this.getBuseSchedule1(this.clientId);
  }

  getBuseSchedule(clientId: any) {
    const formURlData = new URLSearchParams();
    formURlData.set('id', clientId);
    this.service.postAPI(`get-user-info-by-id`, formURlData).subscribe({
      next: (resp: any) => {
        this.clientData = resp.user;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getBuseSchedule1(clientId: any) {
    const formURlData = new URLSearchParams();
    formURlData.set('client_id', '14');
    this.service.postAPI(`get-client-all-cases`, formURlData).subscribe({
      next: (resp: any) => {
        this.allCases = resp.data;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  backClicked() {
    this.location.back();
  }


}
