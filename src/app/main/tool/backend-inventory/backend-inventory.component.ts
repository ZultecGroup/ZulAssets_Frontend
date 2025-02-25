import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import { finalize, first } from 'rxjs';
import { GridComponent } from '@progress/kendo-angular-grid';
import { InventoryScheduleDto, InventoryScheduleDtoResponse } from '../../shared/dtos/InventorySchedule/InventoryScheduleDto';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';

@Component({
  selector: 'app-backend-inventory',
  templateUrl: './backend-inventory.component.html',
  styleUrls: ['./backend-inventory.component.scss']
})
export class BackendInventoryComponent implements OnInit {

  public InvSchList: InventoryScheduleDto[] = [];
  allLocation: any = []
  allBackendInv: any = []
  searchString: any= '';
  invSchCode: any;
  locID: any;
  @ViewChild('grid', { static: false }) grid!: GridComponent;

  backendInventoryGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [ 15, 30, 50, 100, 200, 500 ],
  }
  private gridApi!: GridApi;

  private gridDataService = inject(GridDataService)

  constructor(private tableDataService: TableDataService, public GeneralService: GeneralService)
  {
    this.backendInventoryGridCols = this.gridDataService.getColumnDefs(GridType.BackendInventory, this.GeneralService.permissions['Backend Inventory']);
  }

  ngOnInit(): void {
    this.getAllSchedules();
    this.getAllLocations();
  }

  public getAllLocations(){
    this.tableDataService.getTableDataGet('Locations/GetAllLocations')
    .pipe(first(), finalize(() => {}))
    .subscribe({
      next: (res) => {
        if (res) {
          this.allLocation = res;
        } else {

        }
      },
      error: (err) => {}
    })
  }
  public getAllBackendInventory(e:any){
    if (e.hasOwnProperty("invSchCode")) {
      this.invSchCode = e.invSchCode
    }
    if (e.hasOwnProperty("locid")) {
      this.locID = e.locid
    }
    this.tableDataService.getTableData('BackendInv/GetAllAssetsAgainstLocID_InvSchCode', { get: 1, invSchCode: this.invSchCode, locID: this.locID })
    .pipe(first(), finalize(() => {}))
    .subscribe({
      next: (res) => {
        if (res) {
          this.allBackendInv = res;
          this.backendInventoryGridCols = this.gridDataService.getColumnDefs(GridType.BackendInventory, this.GeneralService.permissions['Backend Inventory']);
        }
      },
      error: (err) => {}
    })
  }
  getAllSchedules() {

    this.tableDataService.getTableData('InvSch/GetAllInvSchs', { get: 1, searching: 1, var: this.searchString })
      .pipe(first(), finalize(() => {}))
      .subscribe({
        next: (res: InventoryScheduleDtoResponse) => {
          if (res) {
            this.InvSchList = res.data;
          }
        },
        error: (err) => {}
      })
  }

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    // this.gridApi.showLoadingOverlay()
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    // this.getAllBackendInventory(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.getAllBackendInventory(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
