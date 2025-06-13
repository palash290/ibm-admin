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

  constructor(private router: Router, private shared: SharedService, private authService: AuthService) { }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  logout() {
    this.shared.logout();
  }

  // @Output() toggleEvent = new EventEmitter<boolean>();

  // toggleMenu() {
  //   this.toggleEvent.emit(false);
  // }

}
