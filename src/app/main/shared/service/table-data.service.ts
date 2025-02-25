import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  constructor(public httpService: HttpService) {}
  paginationParam: any = {
    // "from": 0,
    // "to": 100,
    pageIndex: 1,
    pageSize: 15,
  };
  getTableData(moduleUrl: string, payload: any, user: boolean = false)
  {
    if (!user)
    {
      payload.loginName = JSON.parse(localStorage.getItem('userObj')!).loginName;
    }
    const finalPayload =
      payload.get === 1
        ? { ...payload, paginationParam: this.paginationParam }
        : { ...payload };
    return this.httpService.httpPost(moduleUrl, finalPayload);
  }

  getTableDataWithPagination(moduleUrl: string, payload: any) {
    payload.loginName = JSON.parse(localStorage.getItem('userObj')!).loginName;
    const finalPayload = { ...payload };
    return this.httpService.httpPost(moduleUrl, finalPayload);
  }

  InsertNewUser(moduleUrl: string, payload: any) {
    const finalPayload =
      payload.get === 1
        ? { ...payload, paginationParam: this.paginationParam }
        : { ...payload };
    return this.httpService.httpPost(moduleUrl, finalPayload);
  }

  getTableDataGet(moduleUrl: string) {
    return this.httpService.get(moduleUrl);
  }
}
