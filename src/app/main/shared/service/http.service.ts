import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as qs from 'qs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private httpClient: HttpClient,
    private router: Router) {
  }

  post(url: any, obj: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    let data = qs.stringify(obj);
    return this.httpClient.post(`${environment.apiUrl}${url}`, data, { headers });
  }
  get(url: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}${url}`);
  }

  httpPost(url: any, obj: any): Observable<any> {
    // obj.loginName = JSON.parse(localStorage.getItem('userObj')!).loginName
    return this.httpClient.post(`${environment.apiUrl}${url}`, obj);
  }

}
