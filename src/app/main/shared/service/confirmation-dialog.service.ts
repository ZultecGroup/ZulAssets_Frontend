import { Injectable } from '@angular/core';
import { DialogService, DialogRef, DialogResult, DialogCloseResult } from '@progress/kendo-angular-dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor(private dialogService: DialogService) { }

  confirm(): Promise<boolean> {
    const dialogRef: any = this.dialogService.open({
      title: 'Confirmation',
      content: 'Are you sure you want to delete?',
      actions: [
        { text: 'Yes', themeColor: "primary" },
        { text: 'No' }
      ],
      width: 450,
      height: 200,
      minWidth: 250,

    });

    return new Promise<boolean>((resolve, reject) => {
      dialogRef.result.subscribe((result: any) => {
        console.log(result)
        if (result.text === 'Yes') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  customDialog(content:any): Promise<boolean> {
    const dialogRef: any = this.dialogService.open({
      title: 'Confirmation',
      content: content,
      actions: [
        { text: 'Yes', themeColor: "primary" },
        { text: 'No' }
      ],
      width: 450,
      height: 200,
      minWidth: 250,
    });

    return new Promise<boolean>((resolve, reject) => {
      dialogRef.result.subscribe((result: any) => {
        console.log(result)
        if (result.text === 'Yes') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  ApplyPolicy(): Promise<boolean> {
    const dialogRef: any = this.dialogService.open({
      title: 'Confirmation',
      content: `Are you sure you want to apply this policy?\n You will need to print the barcode labels again for all assets.`,
      actions: [
        { text: 'Yes', themeColor: "primary" },
        { text: 'No' }
      ],
      width: 450,
      height: 200,
      minWidth: 250,
    });

    return new Promise<boolean>((resolve, reject) => {
      dialogRef.result.subscribe((result: any) => {
        console.log(result)
        if (result.text === 'Yes') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
