import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../service/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuard  {
  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }
  canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin()
  }
  checkLogin() {
    const token = this.tokenStorageService.getToken();
    if (token) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }
}
