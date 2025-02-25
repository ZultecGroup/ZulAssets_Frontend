import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  controller: string = 'User';
  forgotUserName:any;

  constructor(
    public httpService: HttpService
  ) { }

  login(obj: any) {
    return this.httpService.httpPost(`${this.controller}/Login`, obj);
  }
  forgetPassword(obj: any) {
    return this.httpService.httpPost(`${this.controller}/ForgetPassword`, obj);
  }
  GeneratePasswordToken(obj: any) {
    return this.httpService.httpPost(`${this.controller}/GeneratePasswordToken`, obj);
  }
  refreshToken(obj: any) {
    return this.httpService.httpPost(`${this.controller}/RefreshToken`, obj);
  }
  getMenu(obj: any) {
    return this.httpService.httpPost(`Menus/GetAllMenus`, obj);
  }
  checkAdminUser(obj: any){
    return this.httpService.httpPost(`${this.controller}/CheckAdminUserRole`, obj);
  }
}
