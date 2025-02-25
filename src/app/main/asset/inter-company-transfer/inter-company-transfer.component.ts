import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { debounceTime, distinctUntilChanged, finalize, first, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator, validateAllFormFields } from '../../shared/helper/functions.component';
import { AdministrationDto, AdministrationDtoResponse } from '../../shared/dtos/Administration/AdministrationDto';
import { CompanyDto, CompanyDtoResponse } from '../../shared/dtos/Companies/companyDtos';
import { ColDef, GridApi, GridReadyEvent, RowSelectedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';
import { GLCodesDto, GLCodesDtoResponse } from '../../shared/dtos/GL-Codes/GLCodesDto';
import { AnyARecord } from 'dns';

@Component({
  selector: 'app-inter-company-transfer',
  templateUrl: './inter-company-transfer.component.html',
  styleUrls: [ './inter-company-transfer.component.scss' ],
})
export class InterCompanyTransferComponent implements OnInit
{
  gridView: AdministrationDto[] = [];
  fetchingData: boolean;
  gridData: AdministrationDto[] = [];
  AssetList: AdministrationDto[] = [];
  searchText: string = '';
  searchSubject = new Subject<string>();
  astNum: any;
  purDate: any;
  refCode: any;
  dialogDataGrid: AdministrationDto[] = [];
  companyName: any;
  glCode: any;
  astDesc: any;
  companyId: any;
  glDesc: any;
  interCompanyForm!: FormGroup;
  companyID: any;
  oldCompanyID: any;
  allCompanies: CompanyDto[] = [];
  allGlcodes: any[] = [];
  sendingRequest: boolean;
  dataBinding: any;
  opened: boolean = false;
  selectedAssetId: any;
  astID: any;

  assetListModalGridCols: ColDef[] = [];
  interCompanyTransferGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }
  pagination = {
    currentPage: 1,
    pageSize: 15,
    bookCurrentPage: 1,
    bookPageSize: 15,
    totalItems: 0,
    pageSizes: [ 15, 30, 50, 100, 200, 500 ],
  }
  private gridApi!: GridApi;

  private gridDataService = inject(GridDataService)
currentBV: any;
newAstID: any;
newAstNum: any;
newGlCode: any;

  constructor(
    private fb: FormBuilder,
    private tableDataService: TableDataService,
    private toast: toastService,
    public generalService: GeneralService
  )
  {
    this.assetListModalGridCols = this.gridDataService.getColumnDefs(GridType.AssetListModal, this.generalService.permissions['Inter Company Transfer']);
    this.interCompanyTransferGridCols = this.gridDataService.getColumnDefs(GridType.InterCompanyTransfer, this.generalService.permissions['Inter Company Transfer']);
  }

  ngOnInit(): void
  {
    // this.getAllGridData();
    this.initializeAssetForm();
    this.getAllAssetsAdministrator(this.pagination.currentPage, this.pagination.pageSize)
    this.getAllCompanies();
    this.companyId = this.companyID;
    this.searchHandler();
  }

  private searchHandler()
  {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe((term) =>
    {
      this.searchText = term;
      this.getAllAssetsAdministrator(1, this.pagination.pageSize);
    });
  }

  initializeAssetForm(data?: any)
  {
    this.interCompanyForm = this.fb.group({
      astID: [ '', [Validators.required] ],
      newCompanyID: [ '', [Validators.required] ],
      oldCompanyID: [ '' ],
      glCodes: [ '', [Validators.required] ],
      refNoOld: [ {value:'',disabled: true} ],
      refNo: [ '' ],
      currentBV: [ '', [Validators.required, noWhitespaceValidator()] ],
      salYr: [ '0', [Validators.required, noWhitespaceValidator()] ],
      salValue: [ '0', [Validators.required, noWhitespaceValidator()] ],
      transRemarks: [ '' ],
      astNum: [ {value:'',disabled: true} ],
      purDate: [ {value:'',disabled: true} ],
      astDesc: [ {value:'',disabled: true} ],
      companyName: [ {value:'',disabled: true} ],
      glDesc: [ {value:'',disabled: true} ],

      // invEndDate: [this.today, [Validators.required, noWhitespaceValidator()]],
    });
  }
  getAllAssetsAdministrator(currentPage: number, pageSize: number)
  {
    this.fetchingData = true;

    let payload: any = {
      get: 1,
      paginationParam: {
        pageIndex: currentPage,
        pageSize: pageSize,
      }
    }

    if (this.searchText !== "") {
      payload = {
        ...payload,
        searching: 1,
        var: this.searchText,
      }
    }

    this.tableDataService
      .getTableDataWithPagination('Assets/GetAllAssetsAdministrator', payload)
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: AdministrationDtoResponse) =>
        {
          if (res && res.data.length > 0)
          {
            this.AssetList = res.data.reverse();
            this.dialogDataGrid = this.AssetList;
            this.pagination.currentPage = currentPage
            this.pagination.pageSize = pageSize
            this.pagination.totalItems = res.totalRowsCount[0].totalRowsCount
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  public setAllValues(e: any)
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Company/GetAstInfo', { get: 1, searching: 1, astID: e })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (result) =>
        {
          this.astID = result.assetGeneralInfo[ 0 ].astID;
          this.astNum = result.assetGeneralInfo[ 0 ].astNum;
          this.purDate = new Date(result.assetGeneralInfo[ 0 ].purDate);
          this.refCode = result.assetGeneralInfo[ 0 ].refNo;
          this.companyName = result.assetGeneralInfo[ 0 ].companyName;
          this.oldCompanyID = result.assetGeneralInfo[ 0 ].companyID;
          this.glCode = result.assetGeneralInfo[ 0 ].glCode;
          this.astDesc = result.assetGeneralInfo[ 0 ].astDesc;
          this.gridView = result.assetBookInformation;
          this.opened = false;
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllGridData()
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Assets/GetAllAssetsAdministrator', { get: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: AdministrationDtoResponse) =>
        {
          if (res)
          {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  setBarCodesValues(e: any)
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Company/GetGLCodesAgainstCompanyID', {
        get: 1,
        id: e,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (result) =>
        {
          this.allGlcodes = result;
          console.log(this.allGlcodes, 'glcode');

        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  getAllCompanies()
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Company/GetAllCompanies', { get: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CompanyDtoResponse) =>
        {
          if (res)
          {
            this.allCompanies = res.data.reverse();
            // this.dataCompany= this.allCompanies.slice();
            console.log(this.allCompanies, 'company');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  submit()
  {
    if (this.interCompanyForm.valid)
    {
      this.sendingRequest = true;
      this.interCompanyForm.controls[ 'oldCompanyID' ].setValue(
        this.oldCompanyID
      );
      const apiCall$ = this.tableDataService.getTableData('Company/UpdateAstCompany', {
          add: 1,
          ...this.interCompanyForm.value,
        });
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            this.toast.show(res.message, 'success');
            this.newAstID = res.newAstID
            this.newAstNum = res.astNum
            this.newGlCode = this.glDesc
            // this.setAllValues(this.astID, true);
            // this.router.navigate(['main/master-data/custodians'])
          } else
          {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
        {
          this.toast.show(err.title, 'error');
        },
      });
    } else
    {
      validateAllFormFields(this.interCompanyForm)
    }
  }

  openAssetList()
  {
    this.opened = true;
  }

  public close(status: string): void
  {
    if (status == 'yes')
    {
      this.setAllValues(this.selectedAssetId);
    } else
    {
      this.opened = false;
    }
  }

  onSelectionChange(e: SelectionChangedEvent)
  {
    const selectedNode = e.api.getSelectedNodes()[0];
    console.log('kkhkh',selectedNode.data);
    this.selectedAssetId = selectedNode.data.astID;
    // this.selectedAssetId = e.selectedRows[0].dataItem.astID;
  }

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    // this.gridApi.showLoadingOverlay()
  }

  onFilterTextBoxChanged()
  {
    this.searchSubject.next(this.searchText)
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void
  {
    console.log(event , 'pageChange');
    this.pagination.currentPage = event;
    this.getAllAssetsAdministrator(this.pagination.currentPage, this.pagination.pageSize)
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getAllAssetsAdministrator(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

  onRowClicked(event: any) {
    const curBV = this.currencyFormatter(event.currentBV);

    this.currentBV = curBV;

    console.log('row', event);
  }
   currencyFormatter(currency:any) {
    var sansDec = currency.toFixed(2);
    console.log(sansDec,'sansDec');
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log(formatted,'formatted');
    return formatted;
  }
}
