import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, RouterLink],
  templateUrl: './agent-dashboard.component.html',
  styleUrl: './agent-dashboard.component.css'
})
export class AgentDashboardComponent {


  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;
  userRole: any;
  graphData: any;

  constructor(private authService: AuthService, private service: SharedService) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.getDashboard();
  }

  getDashboard() {
    const payload = {
      number_of_months: '6'
    }

    this.service.postAPI(`admin-dashboard`, payload).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.graphData = resp.data.completedCaseData;
          this.prepareChart(this.graphData);
        } else {
          this.graphData = [];
        }
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  prepareChart(data: any[]) {
    this.chartOptions = {
      chart: {
        type: "bar",
        height: 350
      },
      series: [{
        name: "Completed Cases",
        data: data.map(d => d.count)
      }],
      xaxis: {
        categories: data.map(d => d.month),
        title: {
          text: "Month"
        }
      },
      title: {
        text: "Completed Cases Last 6 Months",
        align: "center"
      },
      dataLabels: {
        enabled: true
      }
    };
  }

  @HostListener('wheel', ['$event'])
  
  onWheelScroll(event: WheelEvent) {
    const chartElement = document.querySelector('apx-chart');
    if (chartElement && chartElement.contains(event.target as Node)) {
      event.preventDefault();
    }
  }


}
