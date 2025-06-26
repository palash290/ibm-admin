import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

    userRole: any;
  
    constructor(private authService: AuthService) { }
  
    ngOnInit() {
      this.userRole = this.authService.getUserRole();
    }


}
