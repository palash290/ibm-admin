import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { CaseWizardStepsComponent } from './case-wizard-steps/case-wizard-steps.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [FormsModule, CaseWizardStepsComponent, RouterOutlet],
  templateUrl: './loan-calculator.component.html',
  styleUrl: './loan-calculator.component.css'
})
export class LoanCalculatorComponent {


  constructor(private location: Location) { }

  dropdownVisible = false;
  searchText = '';
  clients = ['John Doe', 'Jane Smith', 'Another Client']; // Example data

  caseTypes = ['Mortgage', 'Tenancy', 'Litigation']; // Example case types
  selectedCase: string = '';

  showDropdown() {
    this.dropdownVisible = true;
  }

  hideDropdown() {
    this.dropdownVisible = false;
  }

  selectCase(caseType: string) {
    this.selectedCase = caseType;
  }

  // Optional: Hide dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.hideDropdown();
    }
  }

  backClicked() {
    this.location.back();
  }


}
