import { Component } from '@angular/core';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';
import { HeaderComponent } from '../../common/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {

  isMenuActive = false;

  openMenu(isMenuActive: any) {
    this.isMenuActive = isMenuActive; // Update menu active state
  }

  closeMenu(isMenuActive: any) {
    this.isMenuActive = isMenuActive; // Update menu active state
  }

}
