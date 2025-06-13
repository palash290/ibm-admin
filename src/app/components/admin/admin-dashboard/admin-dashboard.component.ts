import { Component, HostListener, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;
  userRole: any;

  constructor(private authService: AuthService, private sharedService: SharedService) {
    this.chartOptions = {
      series: [
        {
          name: "Reports",
          data: [
            20, 22, 23, 40, 50, 35, 52, 25, 45, 48, 47, 49, 90, 44, 53, 51, 48, 55,
            49, 56, 50, 47, 59, 60, 20, 21, 23, 57, 46, 45, 60, 58, 55, 53, 52, 51,
            49, 40, 45, 47, 50, 52, 48, 51,
          ],
        },
      ],
      chart: {
        type: "line",
        height: 300,
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          }
        },
        zoom: {
          enabled: true,
          type: 'x', // can be 'x', 'y', or 'xy'
          autoScaleYaxis: true,
        },
      },
      xaxis: {
        categories: Array.from({ length: 44 }, (_, i) => i + 1),
        labels: { show: true },
      },
      yaxis: {
        max: 100,
        labels: {
          formatter: function (val: number) {
            return val + "%";
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return val + " Reports";
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      colors: ['#00BFFF'], // Optional
      grid: {
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
    };
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.getAllAgents();
  }

  @HostListener('wheel', ['$event'])
  onWheelScroll(event: WheelEvent) {
    const chartElement = document.querySelector('apx-chart');
    if (chartElement && chartElement.contains(event.target as Node)) {
      event.preventDefault(); // Prevent page scroll
    }
  }

  data: any;

  getAllAgents() {

    this.sharedService.getApi(`admin-dashboard`).subscribe({
      next: (resp: any) => {
        this.data = resp.data;
      },
      error: error => {
        //this.agentsList = []
        console.log(error.message);
      }
    });
  }


}
