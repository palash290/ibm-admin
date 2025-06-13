import { Component } from '@angular/core';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';
import { HeaderComponent } from '../../common/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, HeaderComponent],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {

}
