import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { GridComponent, RowArgs } from '@progress/kendo-angular-grid';
import { finalize, first, Subject, take, takeUntil } from 'rxjs';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { InventoryScheduleDto, InventoryScheduleDtoResponse } from '../../shared/dtos/InventorySchedule/InventoryScheduleDto';
import { ColDef, GridApi } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';
import { DataProcessingDto, DataProcessingDtoResponse } from '../../shared/dtos/DataProcessing/DataProcessingDto';
@Component({
  selector: 'app-data-processing',
  templateUrl: './data-processing.component.html',
  styleUrls: ['./data-processing.component.scss']
})
export class DataProcessingComponent implements OnInit {
  gridData: DataProcessingDto[] = [];
  gridView: DataProcessingDto[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  searchString = '';
  auditData: any;
  mySelection: any = [];
  GetAllInvSchs: InventoryScheduleDto[] = [];
  invSchCode: any;
  public form: FormGroup;

  dataProcessingGridCols: ColDef[] = [];

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
assets: any;

  constructor(private ngZone: NgZone, private tableDataService: TableDataService, private toast: toastService, public GeneralService:GeneralService)
  {
    this.dataProcessingGridCols = this.gridDataService.getDataProcessingCols(1);
  }


  ngOnInit(): void {
    this.assets = 'identifiedAssets'
    this.getAllSchedules();
    this.auditData = 1;
    // this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    // {
    //   if (data.gridName === GridType.DataProcessing)
    //   {
    //     this.DeleteProcessingData()
    //   }
    // })
  }


  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  getAllSchedules() {
    this.fetchingData = true
    this.tableDataService.getTableData('InvSch/GetAllInvSchs', { get: 1,dropdown: 1, searching: 1, var: this.searchString })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: InventoryScheduleDtoResponse) => {
          if (res) {
            this.GetAllInvSchs = res.data
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  getDeviceConfiguration(auditData: any) {
    this.gridData = [];
    this.gridView = [];
    this.auditData = auditData;
    this.dataProcessingGridCols = this.gridDataService.getDataProcessingCols(this.auditData)
    console.log('this.invSchCode',this.invSchCode);
    this.fetchingData = true
    this.tableDataService.getTableData('DeviceConfiguration/GetProcessingData', { get: 1, auditData:auditData, invSchCode: this.invSchCode })
      .pipe(finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: DataProcessingDtoResponse) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse()
            console.log(this.auditData);
            // this.dataProcessingGridCols = this.gridDataService.getColumnDefs(GridType.DataProcessing);
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
  DeleteProcessingData() {
    var auditProcessingDataTree: { astID: any; deviceID: any; }[] = []
    var anonymousProcessingDataTree: { nonBCode: any; deviceID: any; transDate: any; }[] = []
    if(this.auditData == 1){
     this.mySelection.forEach ((item: any)=>{
        let current = {
          astID: item.astID,
          deviceID: item.deviceID,
        }
        auditProcessingDataTree.push(current)
      });
    }else{
      if(this.auditData == 0){
        this.mySelection.forEach ((item: any)=>{
           console.log(item.dataItem)
           let current = {
            nonBCode: item.nonBCode,
            deviceID: item.deviceID,
            transDate: item.hisDate,
           }
           anonymousProcessingDataTree.push(current)
         });

       }
    }
    this.tableDataService.getTableData('DeviceConfiguration/DeleteProcessingData', { delete: 1,auditData:this.auditData ,auditProcessingDataTree: auditProcessingDataTree , anonymousProcessingDataTree: anonymousProcessingDataTree})
      .pipe()
      .subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res[0].message, 'success');
          } else {
            this.toast.show(res[0].message, 'error');
          }
          this.getDeviceConfiguration(this.auditData);
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
  onSelectionChange(e: any) {
    this.mySelection = [];
     e.api.getSelectedRows().map((row: any) => {
      this.mySelection.push(row)
    });

    console.log(this.mySelection)
  }


  ProcessAuditData(){
   var processAuditDataTree: { astID: any; astDesc: any; status: number; locID: any; assetStatus: any; noPiece: any; astTransID: any; deviceID: any; }[] = []
   this.mySelection.forEach ((item: any)=>{
    console.log(item)
    let current = {
      "astID": item?.astID,
      "astDesc": item?.astDesc,
      "status": item?.status,
      "locID": item.fromLoc ? item.fromLoc :item.locID,
      "assetStatus": item?.assetStatus,
      "noPiece": item?.pieces,
      "astTransID": item?.astTransID,
      "deviceID": item?.deviceID
    }
    processAuditDataTree.push(current)
  });
  this.tableDataService.getTableData('DeviceConfiguration/ProcessAuditData', { invSchCode:this.invSchCode , processAuditDataTree})
      .pipe()
      .subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
          } else {
            this.toast.show(res[0].message ?res[0].message : res.message , 'error');
          }
          this.getDeviceConfiguration(this.auditData);
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  getDevice(){
    this.getDeviceConfiguration(this.auditData);
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    // this.getDeviceConfiguration(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.getDeviceConfiguration(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

  openAsset(){
    console.log('this.mySelection',this.mySelection);
    if(this.mySelection.length > 0){
      this.mySelection.forEach((x:any) => {
      window.open('#/main/asset/details-maintenance?astID='+ x.astID);

      });
    }else{
      this.toast.show('Select the Data', 'warning')
    }
  }
}
