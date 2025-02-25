import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  userObj: any = null;

  constructor(
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    // return true;

    this.router.events.subscribe((event:any) => {
      // this._location.subscribe(x => console.log(x));
      if (event && event['id']) {
        this.userObj = localStorage.getItem('token');
        if (this.userObj && event['url'] == '/portal/dashboard') {
          return true;
        }
        // else if (this.userObj && event['urlAfterRedirects'] == '/auth/login') {
        //   this.router.navigateByUrl('/portal/dashboard');
        // }
        else if (event instanceof NavigationEnd && !(event.urlAfterRedirects == '/auth/login') && event.id == 1) {
          this.router.navigateByUrl('/auth/login');
        }
        // else if (this.router.url == '/auth/login' && event['navigationTrigger'] == "popstate") {
        //   return false;
        // }
        else {
          return true;
        }
      }
      return event
    });
    if (this.router['currentNavigation'].id == 1) {
      // if (!this.loginService.routeStack.includes(state['url'])) {
      //   this.loginService.routeStack.push('/auth/login');
      // }
      const urlParams = new URLSearchParams(window.location.hash.replace('#/auth/login', ''));
      const referral_code = urlParams.get('referral_code');
      const access_token = urlParams.get('access_token');
      if (referral_code) {
        this.router.navigateByUrl(`/auth/login?referral_code=${referral_code}`);
      }
      else if (access_token) {
        this.router.navigateByUrl(`/auth/login?access_token=${access_token}`);
      }
      else {
        this.router.navigateByUrl('/auth/login');
      }
    }
    // else if (this.router['currentNavigation'].trigger == "imperative") {
    //   this.addRouteToRouteState(state);
    //   return true;
    // }
    // else if (this.loginService.routeStack.includes(state['url'])) {
    //   this.loginService.routeStack.pop();
    //   return true;
    // }
    else {
      return false;
    }

    // private addRouteToRouteState(state: RouterStateSnapshot) {
    //   if (!this.loginService.routeStack.includes(state['url'])) {
    //     this.loginService.routeStack.push(state['url']);
    //   }
    // }

  }


}
