import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userRole: any = 'Admin';

  constructor(private router: Router) { }

  setUserRole(role: string) {
    this.userRole = role;
    sessionStorage.setItem('userRole', role);
  }

  setAgentId(id: string) {
    sessionStorage.setItem('agentId', id);
  }

  getAgentId(): string {
    return sessionStorage.getItem('agentId') || '';
  }

  getUserRole(): string {
    return sessionStorage.getItem('userRole') || 'Admin';
  }

  isAuthorized(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.getUserRole());
  }


}
