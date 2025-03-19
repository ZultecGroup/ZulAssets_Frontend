import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import
{
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { first, finalize, take, Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { GridComponent, RowArgs } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { noWhitespaceValidator, validateAllFormFields } from '../../shared/helper/functions.component';
import { ColDef, GridApi, GridReadyEvent, RowSelectedEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';
import { AdministrationDto, AdministrationDtoResponse } from '../../shared/dtos/Administration/AdministrationDto';
import { CustodiansDto, CustodiansDtoResponse } from '../../shared/dtos/Custodians/CustodiansDto';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';

@Component({
  selector: 'app-location-custody-transfer',
  templateUrl: './location-custody-transfer.component.html',
  styleUrls: [ './location-custody-transfer.component.scss' ],
})
export class LocationCustodyTransferComponent implements OnInit
{
  locationCheck = new FormControl(false);
  custodianCheck = new FormControl(false);
  fetchingData: boolean;
  locationdisabled: boolean = true;
  custodianDisabled: boolean = true;
  custodianCheckbox: boolean;
  locationCheckbox: boolean;
  assetStatusCheckbox: boolean;
  allCustodian: CustodiansDto[] = [];
  allStatus: any;
  AssetID: any;
  AssetNum: any;
  custodyTransferForm!: FormGroup;
  Custodian: any;
  Location: any;
  Category: any;
  Description: any;
  Status: any;
  AssetList: any;
  astID: string;
  public opened = false;
  isEditIcon = false;

  allAssetsList: AdministrationDto[] = [];
  locTransferTree: any = [];
  custTransferTree: any = [];
  assetStatusTransferTree: any = [];
  selectedAssetsList: any = [];
  public mySelection: number[] = [];
  public dataAssetId: Array<{ name: string; id: number }>;
  public dataCust: CustodiansDto[] = [];
  public dataStatusAsset: Array<{ name: string; id: number }>;
  public dataLocationAsset: Array<{ name: string; id: number }>;

  @ViewChild('grid', { static: false }) grid!: GridComponent;
  @ViewChild('dialogGrid', { static: false }) dialogGrid!: GridComponent;
  searchText: string = '';
  searchSubject = new Subject<string>();
  dataBinding: any;
  gridView: AdministrationDto[] = [];

  assetListModalGridCols: ColDef[] = [];
  locationCustodyTransferGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }
  pagination = {
    currentPage: 1,
    assetCurrentPage: 1,
    pageSize: 15,
    assetPageSize: 15,
    totalItems: 0,
    pageSizes: [ 15, 30, 50, 100, 200, 500 ],
  }
  isDestroyed$: Subject<boolean> = new Subject();

  private gridApi!: GridApi;
  private actionCellService = inject(ActionCellService)
  private gridDataService = inject(GridDataService)

  constructor(
    private ngZone: NgZone,
    private fb: FormBuilder,
    private toast: toastService,
    public tableDataService: TableDataService,
    private router: Router,
    public GeneralService: GeneralService
  )
  {
    this.assetListModalGridCols = this.gridDataService.getColumnDefs(GridType.AssetListModal, this.GeneralService.permissions['Location/Custody Transfer']);
    this.locationCustodyTransferGridCols = this.gridDataService.getColumnDefs(GridType.LocationCustodyTransfer, this.GeneralService.permissions['Location/Custody Transfer']);
  }

  ngOnInit(): void
  {
    this.getAllCustodians();
    this.getAllLocations();
    this.getAllStatus();
    // this.initializeAddForm();
    this.getAllAssetsAdministrator(this.pagination.currentPage, this.pagination.pageSize);
    // this.custodyTransferForm.controls[ 'locationCheckbox' ].valueChanges.subscribe((res) =>
    // {
    //   if (res)
    //   {
    //     this.custodyTransferForm.controls[ 'custodianCheckbox' ].setValue(false);
    //     this.custodyTransferForm.controls[ 'assetStatusCheckbox' ].setValue(false);
    //     this.custodyTransferForm.controls[ 'FromCustodian' ].setValue('');
    //     this.custodyTransferForm.controls[ 'FromCustodian' ].disable();
    //     this.custodyTransferForm.controls[ 'status' ].setValue('');
    //     this.custodyTransferForm.controls[ 'status' ].disable();
    //     this.custodyTransferForm.controls[ 'FromLocation' ].enable();
    //   } else
    //   {
    //     // this.custodyTransferForm.controls['FromCustodian'].enable();
    //     this.custodyTransferForm.controls[ 'FromLocation' ].disable();
    //   }
    // });
    // this.custodyTransferForm.controls[ 'custodianCheckbox' ].valueChanges.subscribe((res) =>
    // {
    //   if (res)
    //   {
    //     this.custodyTransferForm.controls[ 'locationCheckbox' ].setValue(false);
    //     this.custodyTransferForm.controls[ 'assetStatusCheckbox' ].setValue(false);
    //     this.custodyTransferForm.controls[ 'FromLocation' ].setValue('');
    //     this.custodyTransferForm.controls[ 'FromLocation' ].disable();
    //     this.custodyTransferForm.controls[ 'status' ].setValue('');
    //     this.custodyTransferForm.controls[ 'status' ].disable();
    //     this.custodyTransferForm.controls[ 'FromCustodian' ].enable();
    //   } else
    //   {
    //     this.custodyTransferForm.controls[ 'FromCustodian' ].disable();
    //   }
    // });
    // this.custodyTransferForm.controls[ 'assetStatusCheckbox' ].valueChanges.subscribe((res) =>
    // {
    //   if (res)
    //   {
    //     this.custodyTransferForm.controls[ 'locationCheckbox' ].setValue(false);
    //     this.custodyTransferForm.controls[ 'custodianCheckbox' ].setValue(false);
    //     this.custodyTransferForm.controls[ 'FromLocation' ].setValue('');
    //     this.custodyTransferForm.controls[ 'FromLocation' ].disable();
    //     this.custodyTransferForm.controls[ 'FromCustodian' ].setValue('');
    //     this.custodyTransferForm.controls[ 'FromCustodian' ].disable();
    //     this.custodyTransferForm.controls[ 'status' ].enable();
    //   } else
    //   {
    //     this.custodyTransferForm.controls[ 'status' ].disable();
    //   }
    // });

    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.LocationCustodyTransfer)
      {
        this.deleteitem(data.rowData)
      }
    })

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

  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  onCustodianCheck(event: any)
  {
    // if (event.checked) {
    //   this.custodianDisabled = false;
    //   this.locationdisabled = true;
    // } else {
    //   this.custodianDisabled = true;
    //   this.locationdisabled = true;
    // }
  }
  onLocationCheck(event: any)
  {
    // if (event.checked) {
    //   this.locationdisabled = false;
    //   this.custodianDisabled = true;
    // } else {
    //   this.custodianDisabled = true;
    //   this.locationdisabled = true;
    // }
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
            this.allAssetsList = res.data.reverse();
            this.gridView = this.allAssetsList;
            this.pagination.currentPage = currentPage
            this.pagination.pageSize = pageSize
            this.pagination.totalItems = res.totalRowsCount[0].totalRowsCount
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  removeObjectWithId(arr: any[], assetNum: any, isRowSelected: boolean)
  {
    if (isRowSelected)
    {
      const objWithIdIndex = arr.findIndex((obj) =>
      {
        return obj.assetNum === assetNum
      });

      if (objWithIdIndex > -1)
      {
        arr.splice(objWithIdIndex, 1);
      }
    } else
    {
      const objWithIdIndex = arr.findIndex((obj) =>
      {
        return obj === assetNum
      });

      if (objWithIdIndex > -1)
      {
        arr.splice(objWithIdIndex, 1);
      }
    }

    return arr;
  }
  public isRowSelected = (e: RowArgs): boolean =>
    this.mySelection.indexOf(e.dataItem.assetNum) >= 0;

  onSelectionChange(e: RowSelectedEvent)
  {
    const selected = e.node.isSelected();
    const assetNum = e.data.assetNum;

    if (selected)
    {
      this.mySelection.push(assetNum);
      this.selectedAssetsList.push(e.data);
    } else
    {
      this.removeObjectWithId(this.mySelection, assetNum, false);
      this.removeObjectWithId(this.selectedAssetsList, assetNum, true);
    }
    this.gridApi.setRowData(this.selectedAssetsList);
  }

  ngAfterViewInit(): void
  {
    // this.ngZone.onStable
    //   .asObservable()
    //   .pipe(take(1))
    //   .subscribe(() =>
    //   {
    //     this.grid.autoFitColumns();
    //   });
  }

  openSearchDialog()
  {
    this.opened = true;
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() =>
      {
        this.dialogGrid.autoFitColumns();
      });
  }

  public close(status: string): void
  {
    if (status == 'yes')
    {
    }
    this.opened = false;
  }


  initializeAddForm(data?: any)
  {
    this.custodyTransferForm = this.fb.group({
      locationCheckbox: [ '' ],
      custodianCheckbox: [ '' ],
      assetStatusCheckbox: [ '' ],
      FromLocation: [ { value: '', disabled: true }, [Validators.required, noWhitespaceValidator()] ],
      FromCustodian: [ { value: '', disabled: true }, [Validators.required, noWhitespaceValidator()] ],
      status: [ { value: '', disabled: true }, [Validators.required, noWhitespaceValidator()] ],
    });
  }

  clearSubmit(){
    this.locTransferTree = [];
    this.custTransferTree = [];
    this.assetStatusTransferTree = [];
  }

  submit()
  {
      this.selectedAssetsList.map((x: any) =>
      {
        if (this.locationCheckbox)
        {
          this.locTransferTree.push({
            astID: x.astID,
            fr_Loc: x.locID,
            to_Loc: this.Location,
            assetStatus: x.status,
          });
        }
        if (this.custodianCheckbox)
        {
          this.custTransferTree.push({
            astID: x.astID,
            fromCustodian: x.custodianID,
            toCustodian: this.Custodian,
          });
        }
        if (this.assetStatusCheckbox)
        {
          this.assetStatusTransferTree.push({
            astID: x.astID,
            assetStatus: x.status,
            status: this.Status,
          });
        }
      });
      if (this.custodianCheckbox)
      {
        const apiCall$ = this.tableDataService.getTableData(
          'Assets/Location_Custody_Transfer',
          { update: 1, locationCheckbox: 0, assetStatusCheckbox: 0, custodianCheckbox: 1, custTransferTree: this.custTransferTree }
        );
        apiCall$.pipe(finalize(() => { })).subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success');
              this.clear();
              this.clearSubmit();
            } else
            {
              this.toast.show(res.message, 'error');
              this.clearSubmit();

            }
          },
          error: (err) =>
          {
            this.toast.show(err.title, 'error');
            this.clearSubmit();

          },
        });
      }
      if (this.locationCheckbox)
      {
        const apiCall$ = this.tableDataService.getTableData(
          'Assets/Location_Custody_Transfer',
          { add: 1, locationCheckbox: 1, assetStatusCheckbox: 0, custodianCheckbox: 0, locTransferTree: this.locTransferTree }
        );
        apiCall$.pipe(finalize(() => { })).subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success');
              this.clear();
              this.clearSubmit();
            } else
            {
              this.toast.show(res.message, 'error');
              this.clearSubmit();

            }
          },
          error: (err) =>
          {
            this.toast.show(err.title, 'error');
            this.clearSubmit();

          },
        });
      }
      if (this.assetStatusCheckbox)
      {
        const apiCall$ = this.tableDataService.getTableData(
          'Assets/Location_Custody_Transfer',
          { add: 1, locationCheckbox: 0, assetStatusCheckbox: 1, custodianCheckbox: 0, assetStatusTransferTree: this.assetStatusTransferTree }
        );
        apiCall$.pipe(finalize(() => { })).subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success');
              this.clear();
              this.clearSubmit();

            } else
            {
              this.toast.show(res.message, 'error');
              this.clearSubmit();

            }
          },
          error: (err) =>
          {
            this.toast.show(err.title, 'error');
            this.clearSubmit();

          },
        });
      }

  }
  clear(){
    this.custodianCheckbox = false;
    this.locationCheckbox = false;
    this.assetStatusCheckbox = false;
    this.Custodian = null
    this.Location = null
    this.Status = null
    this.selectedAssetsList = []
    this.gridApi.deselectAll();
    this.getAllAssetsAdministrator(this.pagination.currentPage, this.pagination.pageSize);

  }
  getAllStatus()
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableDataGet('Assets/GetAssetsStatusWeb')
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) =>
        {
          if (res)
          {
            this.allStatus = res.data.reverse();
            this.dataAssetId = this.allStatus.slice();
            console.log(this.allStatus, 'Status__');
          } else
          {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllCustodians()
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Custodians/GetAllCustodians', { get: 1, dropDown: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CustodiansDtoResponse) =>
        {
          if (res)
          {
            this.allCustodian = res.data.reverse();
            this.dataCust = this.allCustodian.slice();
            console.log(this.allCustodian, 'Cust__');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  allLocation: any = [];
  public getAllLocations()
  {
    this.tableDataService
      .getTableData('Locations/GetAllLocationsTreeView', { get: 1, searching: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) =>
        {
          if (res)
          {
            this.allLocation = this.treeConstructLoc(res);;
            console.log(this.allLocation, 'location__ tree');
          } else
          {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  handleAsset(value: any)
  {
    this.dataAssetId = this.AssetList.filter(
      (s: any) => s.astID.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleCustodian(value: any)
  {
    this.allCustodian= this.dataCust.filter(
      (s: any) =>
        s.custodianName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  deleteitem(dataItem: any)
  {
    console.log(dataItem);
    this.removeObjectWithId(this.mySelection, dataItem.assetNum, false);
    const objWithIdIndex = this.selectedAssetsList.findIndex(
      (obj: { astID: any }) => obj.astID === dataItem.astID
    );
    if (objWithIdIndex > -1)
    {
      this.selectedAssetsList.splice(objWithIdIndex, 1);
    }

    this.gridApi.setRowData(this.selectedAssetsList);
  }
  handleStatus(value: any)
  {
    this.allStatus = this.dataStatusAsset.filter(
      (s: any) => s.status.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  handleLocation(value: any)
  {
    this.dataLocationAsset = this.allLocation.filter(
      (s: any) => s.values.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
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

  get filterExpandSettings(): FilterExpandSettings {
    return { expandMatches: true };
  }
  ///////////////// tree drop loc ////////////
treeConstructLoc(treeData: LocationNodeFlat[])
{
  let constructedTree: never[] = [];
  for (let i of treeData)
  {
    let treeObj = i;
    let assigned = false;
    if (treeObj)
    {
      this.constructTreeLoc(constructedTree, treeObj, assigned);
    }
  }
  return constructedTree;
}

constructTreeLoc(
  constructedTree: any,
  treeObj: LocationNodeFlat,
  assigned: boolean
)
{
// console.log('test', treeObj.locLevel)
  if (treeObj.locLevel == 0 || treeObj.locLevel == null)
  {
    treeObj.children = [];
    constructedTree.push(treeObj);
    return true;
  } else if (treeObj.locID.slice(0, treeObj.locID.lastIndexOf('-')) == constructedTree.locID)
  {

    treeObj.children = [];
    constructedTree.children.push(treeObj);
    constructedTree.children = constructedTree.children.filter((value: { iD1: any }, index: any, self: any[]) =>
      index === self.findIndex((t) => (
        t.iD1 === value.iD1
      ))
    )
    return true;
  } else
  {
    if (constructedTree.children != undefined)
    {
      for (let index = 0; index < constructedTree.children.length; index++)
      {
        let constructedObj = constructedTree.children[ index ];
        if (assigned == false)
        {
          assigned = this.constructTreeLoc(constructedObj, treeObj, assigned);
        }
      }
    } else
    {
      for (let index = 0; index < constructedTree.length; index++)
      {
        let constructedObj = constructedTree[ index ];
        if (assigned == false)
        {
          assigned = this.constructTreeLoc(constructedObj, treeObj, assigned);
        }
      }
    }
    return false;
  }
}
}
interface LocationNodeFlat
{
  parentid: string;
  locID: string;
  locDesc: string;
  isDeleted: boolean;
  iD1: number;
  code: string;
  compCode: string;
  locationFullPath: string;
  companyID: number;
  locLevel: number;
  children?: LocationNodeFlat[];
}
