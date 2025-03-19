import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  map,
  Subject,
} from 'rxjs';
import { LocationsComponent } from 'src/app/main/company-profile/locations/locations.component';
import { GridType } from 'src/app/main/shared/dtos/GridType/GridType';
import {
  InventoryScheduleDtoResponse,
  InventoryScheduleDto,
} from 'src/app/main/shared/dtos/InventorySchedule/InventoryScheduleDto';
import {
  noWhitespaceValidator,
  validateAllFormFields,
} from 'src/app/main/shared/helper/functions.component';
import { ActionCellService } from 'src/app/main/shared/service/action-cell.service';
import { GeneralService } from 'src/app/main/shared/service/general.service';
import { GridDataService } from 'src/app/main/shared/service/grid-data.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-inventory-schedules',
  templateUrl: './add-update-inventory-schedules.component.html',
  styleUrls: ['./add-update-inventory-schedules.component.scss'],
})
export class AddUpdateInventorySchedulesComponent implements OnInit {
  today = new Date();
  scheduleForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  scheduleId!: number;
  fetchingData: boolean = false;
  selectedRowsMap: Map<number, any> = new Map(); // Key is a unique identifier like rowNo or invSchCode

  selectedLeafNodes: any;
  gridData: any[] = [];
  gridView: any[] = [];

  searchText = '';

  deviceConfigGridCols: ColDef[] = [];
  searchSubject = new Subject<string>();

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  isDestroyed$: Subject<boolean> = new Subject();
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [15, 30, 50, 100, 200, 500],
  };
  private gridApi!: GridApi;
  // Set unique row identifier using hardwareID
  getRowId = (params: any) => params.data.hardwareID;

  private actionCellService = inject(ActionCellService);
  private gridDataService = inject(GridDataService);
  fullData: any;
  locTrees: { locID: string }[];
  deviceTrees: any;
  invStartDate: any = this.today;

  constructor(
    private intl: IntlService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: TableDataService,
    private toast: toastService,
    private router: Router,
    public GeneralService: GeneralService
  ) {
    this.deviceConfigGridCols = this.gridDataService.getColumnDefs(
      GridType.inventroyDevices,
      this.GeneralService.permissions['Device Configuration']
    );
  }

  ngOnInit(): void {
    this.getAllDevice(1, 15);

    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.scheduleId = params['id'];

    this.isEditMode = !!this.scheduleId;
    if (this.isEditMode) {
      this.getScheduleById();
    }
    this.initializescheduleForm();

    this.searchHandler();

  }

  onTreeReady() {
    if (this.isEditMode) {
      this.GeneralService.setPreselectedNodes(this.locTrees);
      this.selectDevice();
    }
  }

  selectDevice() {
    // Programmatically select rows based on hardwareID

    const hardwareIDs = this.deviceTrees.map(
      (item: any) => item.deviceHardwareID
    );
    console.log('hardwareIDs', hardwareIDs);
    hardwareIDs.forEach((hardwareID: any) => {
      const rowNode = this.gridApi.getRowNode(hardwareID); // Get rowNode using hardwareID
      // if (rowNode?.data && rowNode.data.hardwareID) {
      this.selectedRowsMap.set(hardwareID, rowNode?.data);
      // }
      console.log(rowNode, 'rw node');
      if (rowNode) {
        rowNode.setSelected(true); // Select the row
      }
    });
  }
  getScheduleById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: 1,
      pageSize: 5000,
    };
    this.dataService
      .getTableDataWithPagination('InvSch/GetAllInvSchs', {
        get: 1,
        searching: 1,
        var: this.scheduleId,
        paginationParam,
      })
      .pipe(
        map((schedulesList: any) =>
          schedulesList.data.find(
            (schedule: any) => schedule.invSchCode == this.scheduleId
          )
        ),
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          this.fullData = res;
          this.scheduleForm.patchValue({
            invSchCode: res?.invSchCode,
            invDesc: res?.invDesc,
            invStartDate: new Date(res?.invStartDate ?? ''),
            invEndDate: new Date(res?.invEndDate ?? ''),
          });
          this.deviceTrees = res?.deviceTrees;
          this.locTrees = res?.locTrees;
          this.onTreeReady();
          console.log('loc tree', res?.locTrees);
          // this.GeneralService.setPreselectedNodes(res?.locTrees);
        },
      });
  }

  initializescheduleForm() {
    this.scheduleForm = this.fb.group(
      {
        invSchCode: ['0'],
        invDesc: ['', [Validators.required, noWhitespaceValidator()]],
        invStartDate: [this.today, [Validators.required]],
        invEndDate: [this.today, [Validators.required]],
      },
      { validator: this.dateRangeValidator } // Custom validator for the date range
    );
  }
  dateRangeValidator(group: FormGroup): { [key: string]: any } | null {
    const start = group.get('invStartDate')?.value;
    const end = group.get('invEndDate')?.value;

    if (start && end && new Date(start) > new Date(end)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }
  onSubmit() {
    if (this.scheduleForm.valid) {
      let locationTree: any = [];
      this.selectedLeafNodes.map((x: any) => {
        locationTree.push({
          locID: x.locID,
        });
      });
      let deviceTree: any = [];
      Array.from(this.selectedRowsMap.keys())
      .map((x: any) => {
        deviceTree.push({
          deviceHardwareID: x,
        });
      });
      this.sendingRequest = true;
      const apiCall$ = this.isEditMode
        ? this.dataService.getTableData('InvSch/UpdateInvSch', {
            update: 1,
            ...this.scheduleForm.value,
            locTrees: locationTree,
            deviceTrees: deviceTree,
          })
        : this.dataService.getTableData('InvSch/InsertInvSch', {
            add: 1,
            ...this.scheduleForm.value,
            locTrees: locationTree,
            deviceTrees: deviceTree,
          });
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.router.navigate(['main/master-data/inventory-schedules']);
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.scheduleForm);
    }
  }

  ////////

  getInvtorySelectedLocations(data: any) {
    this.selectedLeafNodes = data;
  }

  onFilterTextBoxChanged() {
    this.searchSubject.next(this.searchText);
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  private searchHandler() {
    this.searchSubject
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((term) => {
        this.searchText = term;
        this.getAllDevice(1, this.pagination.pageSize);
      });
  }

  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    this.getAllDevice(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number) {
    this.resetPaginator();
    this.pagination.pageSize = event;
    this.getAllDevice(this.pagination.currentPage, this.pagination.pageSize);
  }

  private resetPaginator() {
    this.pagination.currentPage = 1;
    this.pagination.totalItems = 0;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // this.gridApi.showLoadingOverlay()
  }

  getAllDevice(currentPage: number, pageSize: number) {
    this.fetchingData = true;
    let payload: any = {
      get: 1,
      paginationParam: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    };
    if (this.searchText !== '') {
      payload = {
        ...payload,
        searching: 1,
        var: this.searchText,
      };
    }
    this.dataService
      .getTableDataWithPagination('DeviceConfiguration/GetAllDevices', payload)
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.totalItems = res.totalRowsCount;
            setTimeout(() => this.reapplySelection(), 0); // Reapply selection after the grid refresh

            console.log(this.gridView, 'gridview');
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  onRowDataUpdated() {
    // this.selectDevice();
  }
  onSelectionChanged() {
    const selectedNodes = this.gridApi.getSelectedNodes();

    // Add newly selected rows to the global map
    selectedNodes.forEach((node) => {
      if (node.data && node.data.hardwareID) {
        this.selectedRowsMap.set(node.data.hardwareID, node.data);
      }
    });

    // Remove rows no longer selected from the map
    const deselectedNodes = this.gridApi
      .getRenderedNodes()
      .filter((node) => !node.isSelected());
    deselectedNodes.forEach((node) => {
      if (node.data && node.data.hardwareID) {
        this.selectedRowsMap.delete(node.data.hardwareID);
      }
    });

    console.log(
      'Global Selected Rows Map:',
      Array.from(this.selectedRowsMap.keys())
    );
  }

  reapplySelection() {
    this.gridApi.forEachNode((node) => {
      if (node.data && this.selectedRowsMap.has(node.data.hardwareID)) {
        node.setSelected(true);
      }
    });
  }
}
