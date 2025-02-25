import { GeneralService } from './../../../shared/service/general.service';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { ColDef, GridApi } from 'ag-grid-community';
import { debounceTime, distinctUntilChanged, finalize, first, Subject, takeUntil } from 'rxjs';
import { GridType } from 'src/app/main/shared/dtos/GridType/GridType';
import { ActionCellService } from 'src/app/main/shared/service/action-cell.service';
import { ConfirmationDialogService } from 'src/app/main/shared/service/confirmation-dialog.service';
import { GridDataService } from 'src/app/main/shared/service/grid-data.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { DetailMaintenanceService } from '../detail-maintenance.service';

@Component({
  selector: 'app-tracking-history',
  templateUrl: './tracking-history.component.html',
  styleUrls: ['./tracking-history.component.scss']
})
export class TrackingHistoryComponent implements OnInit {
  @Input() detailsMaintenanceData: any;

  gridData: any[] = [];
  gridView: any[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  search = new FormControl('')
  searchString: string | null = '';
  accessList: Array<Item> = [{ text: "Desktop Application", value: 1 }, { text: "Mobile Application", value: 2 }, { text: "Both", value: 3 }]
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;

  trackingHistoryGridCols: ColDef[] = [];

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
fromLoc: any;
toLoc: any;

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router, private route: ActivatedRoute,
    public generalService: GeneralService
  ) {
    this.trackingHistoryGridCols = this.gridDataService.getColumnDefs(GridType.TrackingHistroy, this.generalService.permissions['Detail & Maintenance']);
  }
  ngOnInit(): void {
    if (this.detailsMaintenanceData != undefined) {
      let tracking =this.detailsMaintenanceData.trackingInformation[0];
      if (tracking != undefined) {
        this.gridView = this.detailsMaintenanceData.trackingInformation;
        this.fromLoc = tracking.fromLocation;
        this.toLoc = tracking.toLocation;
      }
    }

    // this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) => {
    //   if (data.gridName === GridType.TrackingHistroy) {
    //     this.onEditClick(data.rowData.loginName)
    //   }
    // })
  }

  ngOnDestroy() {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }


  getTrackingHistory() {

  }

  onEditClick(Id: number) {
    this.router.navigate(['edit', Id], { relativeTo: this.route });
  }


  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    // this.getTrackingHistory(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number) {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.getTrackingHistory(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator() {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
  onRowClicked(event: any) {
    this.fromLoc = event.fromLocation;
        this.toLoc = event.toLocation;
    console.log('row', event);
  }
}
interface Item {
  text: string;
  value: number;
}
