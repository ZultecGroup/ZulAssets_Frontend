import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { IntlService } from "@progress/kendo-angular-intl";
import { ColDef } from 'ag-grid-community';
import { GridType } from 'src/app/main/shared/dtos/GridType/GridType';
import { ActionCellService } from 'src/app/main/shared/service/action-cell.service';
import { GridDataService } from 'src/app/main/shared/service/grid-data.service';
import { addMonths } from '@progress/kendo-date-math';
import { formatDate } from '@angular/common';
import { ConfirmationDialogService } from 'src/app/main/shared/service/confirmation-dialog.service';
import { GeneralService } from 'src/app/main/shared/service/general.service';
import { noWhitespaceValidator } from 'src/app/main/shared/helper/functions.component';

@Component({
  selector: 'app-extended-warranty',
  templateUrl: './extended-warranty.component.html',
  styleUrls: ['./extended-warranty.component.scss']
})
export class ExtendedWarrantyComponent implements OnInit {
  @Input() detailsMaintenanceData: any;
  extendWarranty!: FormGroup;
  astID: string;
  warrantyStart: any;
  warrantyPeriodMonth: any;
  warrantyEnd: any;
  alarmActivate: any;
  isEditMode: boolean = false;
  sendingRequest: boolean = false;
  assetInfo: any;
  gridData: any[] = [];
  gridView: any[] = [];
  public formatData = [new Date(), 10.5];
  public newDate: Date = new Date();

  extendedWarrantyGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }
  isDestroyed$: Subject<boolean> = new Subject();
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [ 15, 30, 50, 100, 200, 500 ],
  }

  private actionCellService = inject(ActionCellService)
  private gridDataService = inject(GridDataService)
  id: any;

  constructor(
    public intl: IntlService,
    private fb: FormBuilder,
    public tableDataService : TableDataService,
    private confirmationDialogService: ConfirmationDialogService,
    private toast: toastService,
    public generalService: GeneralService
  ) {
    this.extendedWarrantyGridCols = this.gridDataService.getColumnDefs(GridType.ExtendedWarranty, this.generalService.permissions['Detail & Maintenance']);
  }

  ngOnInit(): void {

      if (this.detailsMaintenanceData != undefined) {
        this.astID = this.detailsMaintenanceData.assetInformationExtendentedInformation[0].astID
        let warrenty =this.detailsMaintenanceData.warrantyData[0];
        if (warrenty != undefined) {
          this.gridData = this.detailsMaintenanceData.warrantyData;
           this.calculateExpire();
        }
      }

    this.extendWarranty = this.fb.group({
      warrantyStart: ['', [Validators.required, noWhitespaceValidator()]],
      WarrantyEnd: [{value: '', disabled: true}],
      warrantyPeriodMonth: ['', [Validators.required, noWhitespaceValidator()]],
      alarmActivate: [''],
    })

    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
      {
        if (data.gridName === GridType.ExtendedWarranty)
        {
          this.removeHandler(data.rowData)
          console.log('datas',data.rowData);
        }
      })
  }

  ngOnDestroy() {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  calc(){
    this.warrantyEnd = addMonths(this.warrantyStart,this.warrantyPeriodMonth);
  }

  calculateExpire(){
    this.gridView = this.gridData.map(item =>{
      let x: any =addMonths(new Date(item.warrantyStart),item.warrantyPeriodMonth)
      return {...item, enddate: formatDate(x, 'MM/dd/yyyy', 'en'), warrantyStart: formatDate(item.warrantyStart, 'MM/dd/yyyy', 'en')  }
});
console.log(this.gridView,'this.gridView');
  }

  submit(){

    this.sendingRequest = true
    const apiCall$ = this.isEditMode ?
    this.tableDataService.getTableData('Warranty/UpdateWarranty', { update: 1, id:this.id, astID:this.astID, ...this.extendWarranty.value }) :
    this.tableDataService.getTableData('Warranty/InsertWarranty', { add: 1, astID:this.astID, ...this.extendWarranty.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            this.toast.show(res.message, 'success')
            this.extendWarranty.reset()
            this.setAllValues(this.astID);
            // this.GetAssestInfo();
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
  }
  // GetAssestInfo(){
  //   this.tableDataService.getTableData('Assets/GetAstInfoByAstID', { get: 1, searching: 1,astID: this.astID })
  //     .pipe(first(), finalize(() => this.sendingRequest = false))
  //     .subscribe({
  //       next: (result) => {
  //       this.assetInfo =result;
  //       this.gridData = result.warrantyData?.reverse();
  //       this.gridView = this.gridData.reverse()
  //       this.gridView.map((x)=>{
  //         x.warrantyStart = new Date(x.warrantyStart)
  //         x.warrantyStart =this.intl.toString(x.warrantyStart, "d")
  //         const newdate =this.addMonths(x.warrantyStart , x.warrantyPeriodMonth)
  //         x.enddate =this.intl.toString(newdate, "d")
  //       })
  //       console.log(this.gridView)
  //       //
  //     },error: (err) => {
  //       this.toast.show(err.title, 'error')
  //     }
  //   })
  // }
  edit(dataItem: any){
    console.log('dataItem',dataItem);
    this.warrantyStart = new Date(dataItem.warrantyStart)
    this.warrantyPeriodMonth = dataItem.warrantyPeriodMonth
    this.warrantyEnd = new Date(dataItem.enddate)
  }
  clear(){
    this.isEditMode = false;

    this.warrantyStart= null;
  this.warrantyPeriodMonth= null;
  this.warrantyEnd= addMonths(this.warrantyStart,this.warrantyPeriodMonth);
  }
  addMonths(date:any , months: any) {
   var newDate =new Date(new Date(date).setMonth(new Date(date).getMonth() + months))
   return newDate;
  }

  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    // this.GetAssestInfo(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number) {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.GetAssestInfo(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator() {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

  onRowClicked(event: any) {
    this.isEditMode = true;
  this.warrantyStart= new Date (event.warrantyStart);
  this.warrantyPeriodMonth= event.warrantyPeriodMonth;
  this.alarmActivate= true;
  this.warrantyEnd= addMonths(this.warrantyStart,this.warrantyPeriodMonth);
  this.id = event.id

    console.log('row', event);
  }

  removeHandler(itemCode: any)
  {
    this.confirmationDialogService.confirm()
      .then((confirmed) =>
      {
        if (confirmed)
        {
          this.sendingRequest = true;
          // const payload =  itemCode
          this.tableDataService.getTableData('Warranty/DeleteWarranty', { delete: 1, warrantyID:itemCode.id , astID:itemCode.astID })
            .pipe(first(), finalize(() => this.sendingRequest = false))
            .subscribe({
              next: (res) =>
              {
                if (res && res.status === '200')
                {
                  this.toast.show(res.message, 'success')
                  this.setAllValues(this.astID);
                } else
                {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      })
  }

  public setAllValues(e:any){
    this.sendingRequest = true;
    this.tableDataService.getTableData('Assets/GetAstInfoByAstID', { get: 1, searching: 1,astID: e })
      .pipe(first(), finalize(() => this.sendingRequest = false))
      .subscribe({
        next: (result) => {
          if (result.hasOwnProperty("warrantyData")) {
            this.gridData = result.warrantyData;
            this.calculateExpire();
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
}
