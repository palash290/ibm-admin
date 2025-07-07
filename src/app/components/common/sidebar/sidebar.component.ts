import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  userRole: any;
  permissionNames: string[] = [];

  constructor(private router: Router, private shared: SharedService, private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    const storedPermissions = localStorage.getItem('subAdminPermissions');
    this.permissionNames = storedPermissions ? JSON.parse(storedPermissions) : [];
  }

  hasPermission(name: string): boolean {
    return this.permissionNames.includes(name);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  logout() {
    this.shared.logout();
  }

  @Output() toggleEvent = new EventEmitter<boolean>();

  toggleMenu() {
    sessionStorage.setItem('selectedCaseName', '');
    sessionStorage.setItem('selectedClientName', '');
    sessionStorage.setItem('selectedClientId', '');
    sessionStorage.setItem('selectedCaseType', '');
    sessionStorage.removeItem('client_case_id');
    this.toggleEvent.emit(false);
  }


}
