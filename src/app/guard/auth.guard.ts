import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(SharedService);
  if (authService.isLogedIn()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(SharedService);

  if (authService.isLogedIn()) {
    router.navigate(['/home']);
    return false;
  } else {
    return true;
  }
};