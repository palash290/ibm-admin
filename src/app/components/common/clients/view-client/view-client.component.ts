import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-client',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './view-client.component.html',
  styleUrl: './view-client.component.css'
})
export class ViewClientComponent {


  clientId: any;
  carFeaturesList: string[] = [];

  constructor(private service: SharedService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.clientId = this.route.snapshot.queryParamMap.get('id');
    this.getBuseSchedule(this.clientId);
  }

  clientData: any;

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

  backClicked() {
    this.location.back();
  }


}
