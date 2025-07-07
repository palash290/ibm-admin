import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  first_name: any;
  phone: any;
  profileImg: string | ArrayBuffer | null = null;
  userEmail: any;
  userRole: any;
  dropdownOpen = false;

  @ViewChild('closeModal') closeModal!: ElementRef;

  constructor(private service: SharedService, private authService: AuthService) { }


  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.service.refreshSidebar$.subscribe(() => {
      this.loadUserProfile();
    });
    //this.loadUserProfile();
  }

  loadUserProfile() {
    this.service.getApi('get-profile').subscribe({
      next: (resp) => {
        //debugger
        this.userEmail = resp.user.email;
        this.first_name = resp.user.name;
        this.phone = resp.user.phone_number;
        this.profileImg = resp.user.profile_image;
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  logout() {
    this.closeModal.nativeElement.click();
    this.service.logout();
  }


  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @Output() toggleEvent = new EventEmitter<boolean>();

  toggleMenu() {
    this.toggleEvent.emit(true);
  }


}
