import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActionCellService {

  constructor() { }

  private primaryClickedSubject = new Subject<{ gridName: string, rowData: any }>();
  private secondaryClickedSubject = new Subject<{ gridName: string, rowData: any }>();
  primaryClicked$ = this.primaryClickedSubject.asObservable();
  secondaryClicked$ = this.secondaryClickedSubject.asObservable();

  public onPrimaryClicked(data: any): void
  {
    this.primaryClickedSubject.next(data);
  }

  public onSecondaryClicked(data: any): void
  {
    this.secondaryClickedSubject.next(data);
  }
 
}
