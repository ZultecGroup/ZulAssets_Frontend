import { Injectable } from "@angular/core";
import { NotificationService } from "@progress/kendo-angular-notification";

@Injectable({
  providedIn: 'root'
})
export class toastService {

  constructor(
    public notificationService: NotificationService,
  ) { }

  public show(msg?: any, msgType?: any): void {
    this.notificationService.show({
      content: msg ? msg : 'Something went wrong',
      cssClass: "button-notification",
      animation: { type: "slide", duration: 200 },
      position: { horizontal: "center", vertical: "top" },
      type: { style: msgType, icon: true },
      hideAfter: 4000
      // closable: true,
    });
  }

}
