import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-compared-loans',
  standalone: true,
  imports: [],
  templateUrl: './view-compared-loans.component.html',
  styleUrl: './view-compared-loans.component.css'
})
export class ViewComparedLoansComponent {

  constructor(private location: Location) { }

  backClicked() {
    this.location.back();
  }

}
