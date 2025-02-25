import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { debounceTime, distinctUntilChanged, finalize, first, Subject } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ColDef } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';

@Component({
  selector: 'app-standard-reports',
  templateUrl: './standard-reports.component.html',
  styleUrls: ['./standard-reports.component.scss']
})
export class StandardReportsComponent implements OnInit {
RFID: any;
astDesc1: any;
refCode: any;
handleCost($event: any) {
throw new Error('Method not implemented.');
}
dataLocation: any[];
dataItem: Object;
filterExpandSettings: any;
locid: any;
barCode: any;
dataCost: any;
costID: any;
handleStatus($event: any) {
throw new Error('Method not implemented.');
}
dataStatus: any;
statusID: any;
handleGlCode($event: any) {
throw new Error('Method not implemented.');
}
AssetType: any;
dataGlCode: any;
glCode: any;
handleBrand($event: any) {
throw new Error('Method not implemented.');
}
Hierarchy: any;
dataBrand: any;
astBrandID: any;
handleCustodian($event: any) {
throw new Error('Method not implemented.');
}
custodianID: any;
setCustodianValues($event: any) {
throw new Error('Method not implemented.');
}
dataCustodian: any;
handleAssetId($event: any) {
throw new Error('Method not implemented.');
}
AssetsNum: any;
AssetList: any;
astID: any;
handleCompany($event: any) {
throw new Error('Method not implemented.');
}
assetsInformationForm: any;
astDescription: any;
catFullPath: any;
dataCompany: any[];
companyId: any;
handleItemCode($event: any) {
throw new Error('Method not implemented.');
}
itemCode: any;
setAssetValues($event: any) {
throw new Error('Method not implemented.');
}


  gridData: any[] = [];
  gridView: any[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  search = new FormControl('')
  searchString: string | null = '';
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;

  standardReportsGridCols: ColDef[] = [];

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
  faFileExcel = faFileExcel
  faFilePdf = faFilePdf
  private gridDataService = inject(GridDataService)

  public standardReports: Array<string> = [
    "Company Assets",
    "Depreciation Books",
    "Expected Depreciation",
    "Assets Tagging",
    "Assets Ledger",
    "Items Inventory",
    "Assets Register",
    "New Tags",
    "Assets Details",
    "Disposed Assets",
    "Assets by Category",
    "Assets by Subcategory",
    "Asset Log"
  ];

  selectedReport: string | null = null;
dataItemCode: any;
virtual: boolean;



  constructor(private tableDataService: TableDataService, private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService, public GeneralService: GeneralService) {
    this.standardReportsGridCols = this.gridDataService.getColumnDefs(GridType.ReportingAudit, this.GeneralService.permissions['Standard Reports']);
  }

  ngOnInit(): void {
  }
  public allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: process(this.gridView, {
      }).data,
    };

    return result;
  }

  public getAuditStatusReports(){

  }

  closeContent() {
    this.selectedReport = null;
  }

  removeHandler(astBrandID: number) {
    this.confirmationDialogService.confirm()
      .then((confirmed) => {
        if (confirmed) {
          this.sendingRequest = true;
          const payload = { astBrandID }
          this.tableDataService.getTableData('Brands/DeleteBrand', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) => {
                if (res && res.status === '200') {
                  this.toast.show(res.message, 'success')
                  this.getAuditStatusReports()
                } else {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      })
  }


  onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;

    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "astBrandName",
            operator: "contains",
            value: inputValue,
          }
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }
  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    // this.getAuditStatusReports(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.getAuditStatusReports(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
