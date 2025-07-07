import { Component } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-agent',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './view-agent.component.html',
  styleUrl: './view-agent.component.css'
})
export class ViewAgentComponent {

  agentId: any;
  carFeaturesList: string[] = [];
  clientsList: any;
  agentData: any;
  userImg1: any;

  constructor(private service: SharedService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.agentId = this.route.snapshot.queryParamMap.get('id');
    this.getBuseSchedule(this.agentId);
    this.getAllClientsByAgentId();
  }

  getBuseSchedule(agentId: any) {
    const formURlData = new URLSearchParams();
    formURlData.set('id', agentId);
    this.service.postAPI(`get-user-info-by-id`, formURlData).subscribe({
      next: (resp: any) => {
        this.agentData = resp.user;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getAllClientsByAgentId() {

    const formURlData = new URLSearchParams();
    formURlData.append('agent_id', this.agentId);

    this.service.postAPI(`get-clients-by-agent-id`, formURlData).subscribe({
      next: (resp: any) => {
        this.clientsList = resp.users;
      },
      error: error => {
        this.clientsList = []
        console.log(error.message);
      }
    });
  }


  backClicked() {
    this.location.back();
  }

  showImg(url: any) {
    this.userImg1 = url;
  }


}
