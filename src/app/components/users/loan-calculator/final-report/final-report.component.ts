import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { SharedService } from '../../../../services/shared.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-final-report',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, NgxPaginationModule],
  templateUrl: './final-report.component.html',
  styleUrl: './final-report.component.css'
})
export class FinalReportComponent {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;
  client_case_id: any;
  p: any = 1;
  caseDetails: any;
  case_type_id: any;
  ourVsRegularPayments: any;

  mortgageHelocCashLoan: any;
  netWorthChart: any;
  totalDespositsVsTotalCash: any;

  adultsData: any[] = [];
  childrenData: any[] = [];
  apiPropertyData: any[] = [];
  apiCreditData: any[] = [];
  apiLoanData: any[] = [];
  apiinvestmentsData: any[] = [];
  apiExpData: any;

  totalCalculations: any;
  finalotalCalculations: any;
  apiPolicyDetails: any;
  loading: boolean = false;

  networthOvertime: any;
  mortgageHelocCashLoanResp: any;

  cash_deposited_maturity: any;
  cash_value_maturity: any;

  constructor(private sharedService: SharedService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.client_case_id = sessionStorage.getItem('client_case_id') ? sessionStorage.getItem('client_case_id') : this.route.snapshot.queryParamMap.get('id');;
    this.getPeoplesDetails();
    this.getClientCase();
    this.getTotals(this.client_case_id);
    this.graphCalc();
  }

  latestPlanCalculation: any[] = [];
  report_data: any;
  step_data: any;
  finalVals: any;
  monthly_policy_premium_expense: any;

  planDescriptions: any[] = [];

  graphCalc() {
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`create-plan`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {

          // this.getPlanString(2, resp.plan)
          resp.plan.forEach((planItem: any) => {
            const year = planItem.year;

            if (this.case_type_id == 2) {
              var resultText = this.getPlanStringHeloc(year, resp.plan);
            }

            if (this.case_type_id == 1) {
              var resultText = this.getPlanStringMortgage(year, resp.plan);
            }

            console.log(`Year ${year}:`, resultText);

            if (resultText) {
              this.planDescriptions.push({ year, text: resultText });
            }
          });

          this.latestPlanCalculation = resp.plan;

          this.step_data = resp.step_data;

          this.report_data = resp.report_data;

          this.ourVsRegularPaymentsGraph(resp);

          this.mortgageHelocCashLoanGraph(resp);

          this.netWorthChartGraph(resp);

          this.totalDespositsVsTotalCashGraph(resp);

          // this.finalVals = resp.plan.at(-1).totals
          this.finalVals = resp.plan[0].totals;

          this.monthly_policy_premium_expense = resp.plan.at(-1).expenses.monthly_policy_premium_expense

        }
      }
    });
  }




  //Property+mortgage+Heloc
  getPlanStringHeloc(year: number, plan: any) {
    const data: any = plan.find((p: any) => p.year == year);
    if (
      data.calculations.specific_credit_balance_payments_this_year.length ||
      data.calculations.specific_loan_balance_payments_this_year.length
    ) {
      const formatAmount = (amount: number) =>
        `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;


      const processBalancePayments = (balance_payments: any) => {
        let mainText = '';
        balance_payments?.map((payment: any) => {
          let amount = '';
          let item = '';
          let text = '';
          Object.keys(payment).map((e: string) => {
            if (e === 'fully_paid' && payment[e] === true) {
              text = ` Completely pay off ${item} with a balance of ${amount}. `;
            } else if (e === 'fully_paid' && payment[e] === false) {
              text = ` Reduce your ${item} by ${amount}. `;
            } else {
              amount = formatAmount(payment[e]);
              item = `${e}`;
            }
          });
          mainText += text;
        });
        return mainText;
      };


      const creditActions =
        data.calculations.specific_credit_balance_payments_this_year || [];
      const loanActions = data.calculations.specific_loan_balance_payments_this_year || [];


      let creditPara = processBalancePayments(creditActions);
      let loanPara = processBalancePayments(loanActions);


      let finalText;


      finalText = `${creditPara}${loanPara} Your redirected monthly payment towards the policy loan is now
        ${formatAmount(
        data.calculations.total_annualized_debt_payments_redirected_so_far / 12.0
      )}.`;


      return finalText;
    }
    return
  };

  //Property+mortgage
  getPlanStringMortgage(year: number, plan: any) {
    const data: any = plan.find((p: any) => p.year === year);
    if (
      data.calculations.specific_credit_balance_payments_this_year.length ||
      data.calculations.specific_loan_balance_payments_this_year.length
    ) {
      const formatAmount = (amount: number) =>
        `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;


      const processBalancePayments = (balance_payments: any) => {
        let mainText = '';
        balance_payments?.map((payment: any) => {
          let amount = '';
          let item = '';
          let text = '';
          Object.keys(payment).map((e: string) => {
            if (e === 'fully_paid' && payment[e] === true) {
              text = ` Completely pay off ${item} with a balance of ${amount}. `;
            } else if (e === 'fully_paid' && payment[e] === false) {
              text = ` Reduce your ${item} by ${amount}. `;
            } else {
              amount = formatAmount(payment[e]);
              item = `${e}`;
            }
          });
          mainText += text;
        });
        return mainText;
      };


      const creditActions =
        data.calculations.specific_credit_balance_payments_this_year || [];
      const loanActions = data.calculations.specific_loan_balance_payments_this_year || [];


      let creditPara = processBalancePayments(creditActions);
      let loanPara = processBalancePayments(loanActions);


      let finalText;
      if (!plan[year - 1]?.starting_policy_loan_balance && year > 1) {
        finalText = `${creditPara}${loanPara} Since your policy loan is paid off, the ${formatAmount(
          data.calculations.total_annualized_debt_payments_redirected_so_far / 12.0
        )} you were redirecting towards your policy loan will now be used to repay your HELOC.
     `;
      } else {
        finalText = `${creditPara}${loanPara} Your redirected monthly payment towards the policy loan is now
        ${formatAmount(
          data.calculations.total_annualized_debt_payments_redirected_so_far / 12.0
        )}.`;
      }
      if (
        plan[year - 1]?.starting_policy_loan_balance &&
        plan[year - 1]
          ?.excess_heloc_funds_used_to_pay_back_policy_loan_this_year &&
        year > 1
      ) {
        finalText =
          finalText +
          ` The left-over ${formatAmount(
            plan[year - 1]
              .excess_heloc_funds_used_to_pay_back_policy_loan_this_year
          )} from your HELOC draw now also goes towards your policy loan. Once the policy loan balance reaches zero, the ${formatAmount(
            data.calculations.total_annualized_debt_payments_redirected_so_far / 12.0
          )} you redirected towards your policy loan now just increases your monthly surplus budget to ${formatAmount(
            data.calculations.total_annualized_debt_payments_redirected_so_far / 12.0 +
            data?.calculations.totals.calculated_monthly_final_surplus_budget
          )} and is paid towards the HELOC balance each month instead.
       `;
      }


      return finalText;
    }
    return
  };

  ourVsRegularPaymentsGraph(resp: any) {
    this.ourVsRegularPayments = {
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },

      series: [
        {
          name: 'Regular Schedule Balance',
          data: resp.report.ourVsRegularPayments.graphBalances
        },
        {
          name: 'Smart Loan Calculator',
          data: resp.report.ourVsRegularPayments.graphMortgage
        }
      ],

      colors: ['#4C6EF5', '#3BC9DB'],

      stroke: {
        curve: 'straight',
        width: 3,
        dashArray: [6, 6]
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.7,
          opacityFrom: 0.15,
          opacityTo: 0.03,
          stops: [0, 80, 100]
        }
      },

      dataLabels: {
        enabled: false
      },

      grid: {
        borderColor: '#e0e0e0',
        strokeDashArray: 4,
        padding: {
          left: 10,
          right: 20,
          top: 10,
          bottom: 10
        }
      },

      xaxis: {
        categories: Array.from(
          { length: resp.report.ourVsRegularPayments.graphBalances.length },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Year",
          style: { fontWeight: 600 }
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: '#555' } }
      },

      yaxis: {
        labels: {
          formatter: (val: number) => `$${val.toLocaleString()}`,
          style: { colors: '#555' }
        }
      },

      legend: {
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '14px',
        markers: {
          width: 10,
          height: 10,
          radius: 12
        }
      },

      tooltip: {
        theme: 'light',
        y: {
          formatter: (val: number) => `$${val.toLocaleString()}`
        }
      }
    };
  }


  mortgageHelocCashLoanGraph(resp: any) {
    this.mortgageHelocCashLoanResp = resp.report.mortgageHelocCashLoan;

    const series: any[] = [];
    const colors: string[] = [];

    // debugger
    // ✅ Add "Mortgage" only if case_type_id != '3'
    if (this.case_type_id != '3') {
      series.push({
        name: "Mortgage",
        data: this.mortgageHelocCashLoanResp.startingMortgageBalance
      });
      colors.push("#222222");
    }

    // ✅ Add "Heloc" only if case_type_id == '2'
    if (this.case_type_id == '2') {
      series.push({
        name: "Heloc",
        data: this.mortgageHelocCashLoanResp.startingHelocBalance
      });
      colors.push("#4880ff");
    }

    // ✅ Always add "Policy Loan"
    series.push({
      name: "Policy Loan",
      data: this.mortgageHelocCashLoanResp.startingPolicyLoanBalance
    });
    colors.push("#ff8800");

    // ✅ Always add "Cash Value (gross)"
    series.push({
      name: "Cash Value (gross)",
      data: this.mortgageHelocCashLoanResp.endingPolicyCashValue
    });
    colors.push("#33cc99");

    this.mortgageHelocCashLoan = {
      chart: {
        type: "bar",
        height: 400,
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true
        }
      },
      series,
      colors,
      xaxis: {
        categories: this.mortgageHelocCashLoanResp.startingMortgageBalance.map((_: any, i: any) => (i + 1).toString()),
        title: { text: "Year" },
        tickAmount: 10,
        labels: { rotate: -45 }
      },
      yaxis: {
        labels: { formatter: (val: number) => `$${val.toLocaleString()}` }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 }
    };
  }

  netWorthChartGraph(resp: any) {
    this.networthOvertime = resp.report.networthOvertime;

    this.netWorthChart = {
      chart: {
        type: "area",
        height: 400,
        toolbar: {
          show: true,
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true
        }
      },
      series: [
        {
          name: "Assets",
          data: this.networthOvertime.assets
        },
        {
          name: "Net Worth",
          data: this.networthOvertime.worth
        },
        {
          name: "Liabilities",
          data: this.networthOvertime.liabilities
        }
      ],
      colors: ["#ff7f0e", "#1f77b4", "#000000"],
      fill: {
        type: "solid",
        opacity: [0.3, 0, 0.3]
      },
      stroke: {
        curve: "straight",
        width: [2, 4, 2]
      },
      xaxis: {
        categories: this.networthOvertime.years,
        title: { text: "Year" },
        tickAmount: 10,
        labels: {
          rotate: -45,
        }
      },
      yaxis: {
        labels: {
          formatter: (val: number) => {
            return `$${val.toLocaleString()}`;
          }
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        y: {
          formatter: (val: number) => {
            return `$${val.toLocaleString()}`;
          }
        }
      }
    };
  }

  totalDespositsVsTotalCashGraph(resp: any) {

    this.cash_value_maturity = resp.report.totalDespositsVsTotalCash.cash.at(-1);
    this.cash_deposited_maturity = resp.report.totalDespositsVsTotalCash.deposits.at(-1);


    this.totalDespositsVsTotalCash = {
      chart: {
        type: "area",
        height: 400,
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      series: [
        {
          name: "Total Cash Value",
          data: resp.report.totalDespositsVsTotalCash.cash
        },
        {
          name: "Total Premiums Paid",
          data: resp.report.totalDespositsVsTotalCash.deposits
        }
      ],
      colors: ["#0000ff", "#000000"],
      fill: {
        type: "solid",
        opacity: [0.3, 0.3]
      },
      stroke: {
        curve: "straight",
        width: [4, 3]
      },
      xaxis: {
        categories: resp.report.totalDespositsVsTotalCash.years,
        title: { text: "Year" },
        tickAmount: 10,
        labels: {
          rotate: -45,
        }
      },
      yaxis: {
        labels: {
          formatter: (val: number) => `$${val.toLocaleString()}`
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        y: {
          formatter: (val: number) => `$${val.toLocaleString()}`
        }
      }
    };
  }




  getClientCase() {
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`get-client-case`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.caseDetails = resp.data;
          this.case_type_id = resp.data.case_type_id;
        }
      },
      error: error => {
        console.log(error.message);
      }
    });
  }




  getPeoplesDetails() {
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`get-client-peoples`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          const allPeople = resp.data.reverse();
          this.getPropertyDetails();
          // Split into adults and children
          this.adultsData = allPeople.filter((person: any) => person.people_type == 'adult');
          this.childrenData = allPeople.filter((person: any) => person.people_type == 'child');
        }
      }
    });
  }

  loan_tenure: any;
  years: number[] = [];
  months: number[] = [];

  getPropertyDetails() {
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);
    this.sharedService.postAPI(`get-client-properties`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {

          this.apiPropertyData = resp.data.reverse();
          this.loan_tenure = resp.data[0].loan_tenure;

          const tenureInYears = (this.loan_tenure / 12).toFixed(0); // 1 decimal place (optional)
          this.loan_tenure = `${tenureInYears}`;
          // this.getCreditDetails();
          this.generateTable();
        } else {
          // this.getCreditDetails();
          this.apiPropertyData = [];
        }
      },
      error: error => {
        // this.getCreditDetails();
        this.apiPropertyData = [0];
        console.log(error.message);
      }
    });
  }

  generateTable() {
    this.years = Array.from({ length: this.loan_tenure }, (_, i) => i + 1); // [1..25]
    this.months = Array.from({ length: 12 }, (_, i) => i + 1);              // [1..12]
  }


  getTotals(id: any) {
    const payload = {
      case_id: id
    };
    this.sharedService.postData(`get-client-totals`, payload).subscribe({
      next: (resp: any) => {
        this.totalCalculations = resp.data;
        this.getFinalTotals(this.client_case_id);
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getFinalTotals(id: any) {
    const payload = {
      case_id: id
    };
    this.sharedService.postData(`get-client-final-totals`, payload).subscribe({
      next: (resp: any) => {
        this.finalotalCalculations = resp.data;
        //this.getMonthlyExp();
        this.submit();
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  getMonthlyExp() {
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`get-client-expenses`, formURlData).subscribe({
      next: (resp: any) => {
        this.apiExpData = this.prepareExpenseList(resp.data[0]);
        this.updateExpenseChart();
        this.getPolicyDetails();
      },
      error: error => {
        this.apiExpData = null;
        console.log(error.message);
      }
    });
  }

  prepareExpenseList(expenseObj: any): any[] {
    const skipKeys = ['id', 'case_id', 'status', 'created_at', 'updated_at'];

    if (!expenseObj || typeof expenseObj !== 'object' || Array.isArray(expenseObj)) {
      console.warn('Invalid expense object:', expenseObj);
      return [];
    }

    return Object.entries(expenseObj)
      .filter(([key, value]: [any, any]) =>
        !skipKeys.includes(key) && parseFloat(value ?? '0') > 0
      )
      .map(([key, value]: [any, any]) => ({
        name: this.formatExpenseKey(key),
        amount: parseFloat(value ?? '0'),
      }));
  }

  formatExpenseKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  getTotalExpenses(): number {
    return this.apiExpData?.reduce((acc: number, item: any) => acc + item.amount, 0) || 0;
  }

  updateExpenseChart() {
    if (!this.apiExpData || this.apiExpData.length === 0) {
      this.chartOptions = null;
      return;
    }

    this.chartOptions = {
      chart: {
        type: "donut",
        height: 320
      },
      series: this.apiExpData.map((item: any) => item.amount),
      labels: this.apiExpData.map((item: any) => item.name),
      colors: [
        "#5e9eff", "#44d07e", "#ffb62e", "#ff4d4f", "#7d4fff",
        "#94bfff", "#25d366", "#ff9933", "#ff3366", "#8c8c8c"
      ],
      legend: {
        position: "bottom",
        fontSize: "14px",
        markers: {
          width: 12,
          height: 12,
        },
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%"
          }
        }
      },
    };
  }

  getPolicyDetails() {
    const formURlData = new URLSearchParams();
    formURlData.append('case_id', this.client_case_id);

    this.sharedService.postAPI(`get-policy-details`, formURlData).subscribe({
      next: (resp: any) => {
        if (resp.success) {
          this.apiPolicyDetails = resp.data.reverse();
          this.submit();
        } else {
          this.apiPolicyDetails = [];
        }
      },
      error: error => {
        this.apiPolicyDetails = [0];
        console.log(error.message);
      }
    });
  }




  submit(): void {
    const payload = {
      case_id: this.client_case_id,
      completed_step: 'final_report_completed',
    };
    this.sharedService.postData(`create-client-total`, payload).subscribe({
      next: (resp: any) => {
        //this.router.navigateByUrl('/user/loan-calculator/expense-reduction');
      },
      error: error => {
        console.log(error.message);
      }
    });
  }








  downloadAllDataAsCSV() {
    let csvContent = '';

    if (this.caseDetails) {
      csvContent += 'Client Name,Case Name,Type,Agent\n';
      csvContent += `${this.caseDetails.full_name},${this.caseDetails.case_name},${this.caseDetails.type_name},${this.caseDetails.agent_name}\n\n`;
    }

    // Expenses
    if (this.apiExpData && this.apiExpData.length) {
      csvContent += 'Expenses\nName,Amount\n';
      this.apiExpData.forEach((item: { name: any; amount: any; }) => {
        csvContent += `${item.name},${item.amount}\n`;
      });
      csvContent += '\n';
    }

    // Properties
    if (this.apiPropertyData && this.apiPropertyData.length) {
      csvContent += 'Properties\n';
      csvContent += 'Name,Address,Value,Equity,Mortgage\n';
      this.apiPropertyData.forEach(prop => {
        csvContent += `${prop.property_name},${prop.property_address},${prop.current_value},${prop.equity},${prop.financed_amount}\n`;
      });
      csvContent += '\n';
    }

    // Credits
    if (this.apiCreditData && this.apiCreditData.length) {
      csvContent += 'Credits\nType,Limit,Balance,Interest,Monthly Payment\n';
      this.apiCreditData.forEach(credit => {
        csvContent += `${credit.credit_type},${credit.credit_limit},${credit.balance},${credit.interest_rate},${credit.monthly_payment}\n`;
      });
      csvContent += '\n';
    }

    // Loans
    if (this.apiLoanData && this.apiLoanData.length) {
      csvContent += 'Loans\nName,Financed,Start Date,Terms,Interest,Balance,EMI\n';
      this.apiLoanData.forEach(loan => {
        csvContent += `${loan.loan_name},${loan.financed_amount},${loan.start_date},${loan.terms},${loan.interest_rate},${loan.current_balance},${loan.monthly_emi}\n`;
      });
      csvContent += '\n';
    }

    // Investments
    if (this.apiinvestmentsData && this.apiinvestmentsData.length) {
      csvContent += 'Investments\nName,Balance,Monthly,Increase %,Projected\n';
      this.apiinvestmentsData.forEach(inv => {
        csvContent += `${inv.investment_name},${inv.balance_amount},${inv.monthly_allotment},${inv.increase_percent},${inv.projected_amount}\n`;
      });
      csvContent += '\n';
    }

    // Summary from totalCalculations
    if (this.totalCalculations) {
      csvContent += 'Summary\n';
      csvContent += `Total Income,${this.totalCalculations.total_income}\n`;
      csvContent += `Total Investment,${this.totalCalculations.total_investment}\n`;
      csvContent += `Total Expenses,${this.totalCalculations.total_expense}\n`;
      csvContent += `Preliminary Surplus,${this.totalCalculations.preliminary_surplus}\n`;
      csvContent += '\n';
    }

    // Final Summary from finalotalCalculations
    if (this.finalotalCalculations) {
      csvContent += 'Final Summary\n';
      csvContent += `Final Total Income,${this.finalotalCalculations.final_total_income}\n`;
      csvContent += `Annual Budget Available,${this.finalotalCalculations.annual_budget_available}\n`;
      csvContent += `Total Expense Reduction,${this.finalotalCalculations.total_expense_reduction}\n`;
      csvContent += `Final Monthly Surplus Budget,${this.finalotalCalculations.final_monthly_surplus_budget}\n`;
      csvContent += `HELOC Room,${this.finalotalCalculations.heloc_room}\n`;
      csvContent += '\n';
    }

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  }


  async downloadPDF1(): Promise<void> {
    this.loading = true;

    // ✅ Enable print mode
    let el = document.querySelectorAll('.print-only')
    el.forEach(x => {
      x.classList.add('print-mode')
    })
    // document.body.classList.add('print-mode');

    // ✅ Wait for browser to apply CSS (VERY IMPORTANT)
    await new Promise((resolve) => setTimeout(resolve, 50));

    const element = document.getElementById('pdfContent');
    if (!element) {
      document.body.classList.remove('print-mode');
      this.loading = false;
      return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pages = element.querySelectorAll('.page');

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      // pages[i].classList.add('ct_mt_5')
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    // ✅ Disable print mode after PDF is created
    // document.body.classList.remove('print-mode');
    // let el = document.querySelectorAll('.print-only')
    el.forEach(x => {
      x.classList.remove('print-mode')
    })

    pdf.save('document.pdf');
    this.loading = false;
  }


  downloadCalculationCSV(plan: any[]) {
    if (!plan?.length) return;

    // Extract headers dynamically from first calculations object
    // ✅ Exclude 'year' if it exists inside calculations
    const calcKeys = Object.keys(plan[0].calculations).filter(k => k !== 'year');

    // Final header list
    const headers = ['year', ...calcKeys];

    // Build CSV rows
    const rows = plan.map(item => {
      const calc = item.calculations;

      // Ensure order of values matches headers
      const values = headers.map(h => {
        if (h === 'year') return item.year; // handle year manually

        const val = calc[h];
        // Stringify arrays/objects safely (keep them in single cell)
        if (Array.isArray(val) || typeof val === 'object') {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        }
        // Escape commas or quotes inside text
        if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val ?? '';
      });

      return values.join(',');
    });

    // Combine headers + rows
    const csvContent = [headers.join(','), ...rows].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'plan.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  }


}
