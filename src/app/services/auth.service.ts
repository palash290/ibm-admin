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
    localStorage.setItem('userRole', role);
  }

  setAgentId(id: string) {
    localStorage.setItem('agentId', id);
  }

  getAgentId(): string {
    return localStorage.getItem('agentId') || '';
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || 'Admin';
  }

  isAuthorized(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.getUserRole());
  }


}
