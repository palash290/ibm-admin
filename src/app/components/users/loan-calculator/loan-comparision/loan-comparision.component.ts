import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { AuthService } from '../../../../services/auth.service';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-loan-comparision',
  standalone: true,
  imports: [RouterLink, NgApexchartsModule, CommonModule],
  templateUrl: './loan-comparision.component.html',
  styleUrl: './loan-comparision.component.css'
})
export class LoanComparisionComponent {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;
  client_case_id: any;
  apiLoanData: any[] = [];

  constructor(private authService: AuthService, private sharedService: SharedService) {
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: "Reports",
    //       data: [
    //         10000, 20000, 30000, 40000, 50000, 60000
    //       ],
    //     },
    //   ],
    //   chart: {
    //     type: "bar",
    //     height: 300,
    //     toolbar: {
    //       show: true,
    //       tools: {
    //         zoom: true,
    //         zoomin: true,
    //         zoomout: true,
    //         pan: true,
    //         reset: true,
    //       }
    //     },
    //     zoom: {
    //       enabled: true,
    //       type: 'x',
    //       autoScaleYaxis: true,
    //     },
    //   },
    //   xaxis: {
    //     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    //     labels: { show: true },
    //   },
    //   yaxis: {
    //     max: 100,
    //     labels: {
    //       formatter: function (val: number) {
    //         return val + "%";
    //       },
    //     },
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   stroke: {
    //     curve: "smooth",
    //   },
    //   tooltip: {
    //     y: {
    //       formatter: function (val: number) {
    //         return val + " Reports";
    //       },
    //     },
    //   },
    //   fill: {
    //     type: "gradient",
    //     gradient: {
    //       shadeIntensity: 1,
    //       opacityFrom: 0.4,
    //       opacityTo: 0,
    //       stops: [0, 90, 100],
    //     },
    //   },
    //   colors: ['#00BFFF'], // Optional
    //   grid: {
    //     strokeDashArray: 4,
    //     xaxis: { lines: { show: true } },
    //     yaxis: { lines: { show: true } },
    //   },
    // };
  }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id');

    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`get-client-loans`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          const data = resp.data.reverse();
          this.apiLoanData = data;

          const loanNames: string[] = [];
          const financedAmounts: number[] = [];
          const interestAmounts: number[] = [];
          const totalAmounts: number[] = [];

          data.forEach((item: any) => {
            const principal = parseFloat(item.financed_amount);
            const rate = parseFloat(item.interest_rate); // Annual interest rate
            const months = parseFloat(item.terms);       // Term in months

            const interest = (principal * rate * months) / (100 * 12);
            const total = principal + interest;

            loanNames.push(item.loan_name);
            financedAmounts.push(principal);
            interestAmounts.push(+interest.toFixed(2));
            totalAmounts.push(+total.toFixed(2));
          });

          this.chartOptions = {
            series: [
              {
                name: 'Financed Amount',
                data: financedAmounts,
              },
              {
                name: 'Interest Amount',
                data: interestAmounts,
              },
              {
                name: 'Total (P + R)',
                data: totalAmounts,
              },
            ],
            chart: {
              type: 'bar',
              height: 300,
              stacked: false, // makes comparison easier; you can disable if not needed
              toolbar: {
                show: true,
              },
              zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true,
              },
            },
            xaxis: {
              categories: loanNames,
              title: {
                text: 'Loan Name',
              },
            },
            yaxis: {
              labels: {
                formatter: (val: number) => '₹' + val.toLocaleString(),
              },
              title: {
                text: 'Amount in ₹',
              },
            },
            tooltip: {
              y: {
                formatter: (val: number) => '₹' + val.toLocaleString(),
              },
            },
            colors: ['#00BFFF', '#FF8C00', '#4CAF50'],
            legend: {
              position: 'bottom',
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '45%',
              },
            },
            dataLabels: {
              enabled: false,
            },
          };

        } else {
          this.apiLoanData = [];
        }
      },
      error: error => {
        this.apiLoanData = [0];
        console.log(error.message);
      }
    });
  }


}
