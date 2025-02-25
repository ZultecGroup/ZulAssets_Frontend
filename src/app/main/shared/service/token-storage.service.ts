import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  public getUserObj() {
    return localStorage.getItem('userObj');
  }

  public saveUserObj(user_obj: any): void {
    localStorage.setItem('userObj', JSON.stringify(user_obj));
  }

  // public deleteUserObj(): void {
  //   localStorage.removeItem('userObj');
  // }

  public getToken() {
    return localStorage.getItem('token')
  }

  public deleteLoginData(): void {
    localStorage.removeItem('userObj');
    localStorage.removeItem('token');
  }

  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

}
