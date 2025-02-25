import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.tokenStorageService.getToken();
    if (token) {
      // User is already logged in, redirect to home page
      this.router.navigate(['main/dashboard']);
      return false;
    }
    return true;
  }

}
