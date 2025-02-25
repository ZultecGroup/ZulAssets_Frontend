import { GeneralService } from './../../../shared/service/general.service';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { ColDef } from 'ag-grid-community';
import { debounceTime, distinctUntilChanged, finalize, first, Subject } from 'rxjs';
import { GridType } from 'src/app/main/shared/dtos/GridType/GridType';
import { ConfirmationDialogService } from 'src/app/main/shared/service/confirmation-dialog.service';
import { GridDataService } from 'src/app/main/shared/service/grid-data.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-custodian-history',
  templateUrl: './custodian-history.component.html',
  styleUrls: ['./custodian-history.component.scss']
})
export class CustodianHistoryComponent implements OnInit {
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

  private gridDataService = inject(GridDataService)

  constructor(public generalService: GeneralService, private tableDataService: TableDataService, private toast: toastService, private confirmationDialogService: ConfirmationDialogService) {
    this.trackingHistoryGridCols = this.gridDataService.getColumnDefs(GridType.CustodianHistory, this.generalService.permissions['Detail & Maintenance']);
  }
  ngOnInit(): void {
    if (this.detailsMaintenanceData != undefined) {
      let tracking =this.detailsMaintenanceData.custodyTransferInformation[0];
      if (tracking != undefined) {
        this.gridView = this.detailsMaintenanceData.custodyTransferInformation;

      }
    }
  }


  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    // this.getCustodianHistory(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number) {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.getCustodianHistory(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator() {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

}
interface Item {
  text: string;
  value: number;
}
