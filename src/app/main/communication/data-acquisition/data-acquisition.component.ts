import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { first, finalize, Subject } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { process } from '@progress/kendo-data-query';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';

@Component({
  selector: 'app-data-acquisition',
  templateUrl: './data-acquisition.component.html',
  styleUrls: ['./data-acquisition.component.scss']
})
export class DataAcquisitionComponent implements OnInit {

  gridData: any[] = [];
  gridView: any[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  search = new FormControl('')
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  searchString = '';

  dataAcquisitionGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }
  private gridApi!: GridApi;
  isDestroyed$: Subject<boolean> = new Subject();
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [ 15, 30, 50, 100, 200, 500 ],
  }

  private gridDataService = inject(GridDataService)

  constructor(private tableDataService: TableDataService, private toast: toastService, private confirmationDialogService: ConfirmationDialogService, public GeneralService: GeneralService) {
    this.dataAcquisitionGridCols = this.gridDataService.getColumnDefs(GridType.DataAcquisition, this.GeneralService.permissions['Data Processing']);
  }

  ngOnInit(): void {
    this.gridView = [
      {
        deviceID: 1,
        deviceDesc: 'Device 1',
        commType: 'MS Active Sync',
        deviceIp: '...',
        progress:''
      }
    ]
    // this.getAllAddresses()
  }

  getAllAddresses() {
    this.fetchingData = true
    this.tableDataService.getTableData('AddressTemplate/GetAllAddressTemplates', { get: 1, searching: 1, var: this.searchString })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          if (res) {
            this.gridData = res.reverse();
            this.gridView = this.gridData.reverse()
          } else {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  removeHandler(addressID: number) {
    this.confirmationDialogService.confirm()
      .then((confirmed) => {
        if (confirmed) {
          this.sendingRequest = true;
          const payload = { addressID }
          this.tableDataService.getTableData('AddressTemplate/DeleteAddressTemplate', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) => {
                if (res && res.status === '200') {
                  this.toast.show(res.message, 'success')
                  this.getAllAddresses()
                } else {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      });
  }

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged(event: Event)
  {
    this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    // this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

}
