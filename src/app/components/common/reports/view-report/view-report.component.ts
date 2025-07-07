import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-report',
  standalone: true,
  imports: [],
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.css'
})
export class ViewReportComponent {

  constructor(private location: Location) { }

  backClicked() {
    this.location.back();
  }

}
