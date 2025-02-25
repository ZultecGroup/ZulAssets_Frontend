import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  DataBindingDirective,
  GridComponent,
} from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { first, finalize, take, Subject } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { ColDef } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';
import { CustodiansDto, CustodiansDtoResponse } from '../../shared/dtos/Custodians/CustodiansDto';
import { BrandsDto, BrandsDtoResponse } from '../../shared/dtos/Brands/BrandsDto';
import { AssetSearchDto } from '../../shared/dtos/AssetsSearch/AssetSearchDto';
import { ActivatedRoute, Params } from '@angular/router';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import { TreeData } from 'mat-tree-select-input';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public opened = false;
  astlist: any;
  astItemDropdown: any;

  public close(status: string): void {
    if (status == 'no') {
      this.astID = '';
      this.astNum = '';
      this.itemCode = '';
      this.astDesc = '';
      this.astBrandID = '';
      this.custodianID = '';
      this.orgHierID = '';
      this.locid = '';
      this.astCatID = '';
    } else {
      this.opened = false;
      this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
    }
  }

  public openSearchDialog(): void {
    this.getAllBrands();
    this.getAllCustodians();
    this.getAllOrganizationHierarchy();
    this.getAllLocations();
    this.getAllCategories();
    this.getAllAssets();
    this.getAllAssItems();
    this.opened = true;
  }

  gridData: AssetSearchDto[] = [];
  gridView: AssetSearchDto[] = [];
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  search = new FormControl('');
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  astID = '';
  astNum = '';
  itemCode = '';
  astDesc = '';
  astBrandID = '';
  custodianID = '';
  orgHierID: any;
  locid: any;
  astCatID: any;
  public brandList: any = [];
  public custodianList: CustodiansDto[] = [];
  public hierarchyList: TreeData[] = [];
  public locationList: TreeData[] = [];
  public categoryList: TreeData[] = [];
  public astDropdown: any = [];

  @ViewChild('grid', { static: false }) grid!: GridComponent;

  assetSearchGridCols: ColDef[] = [];

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
  public virtual: any = {
    itemHeight: 30,
  };

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private route: ActivatedRoute,
    public GeneralService:GeneralService
  ) {
    this.assetSearchGridCols = this.gridDataService.getColumnDefs(GridType.AssetSearch, this.GeneralService.permissions['Location/Custody Transfer']);
  }

  ngOnInit(): void {

    const queryParams = this.route.snapshot.queryParams as Params;

    // const currentPage = Number(queryParams[ 'currentPage' ] ?? this.pagination.currentPage);
    // const pageSize = Number(queryParams[ 'pageSize' ] ?? this.pagination.pageSize);
    // this.getAllAddresses(currentPage, pageSize);
  }

  public getAllLocations() {
    this.tableDataService
      .getTableData('Locations/GetAllLocationsTreeView', { get: 1, searching: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {

          if (res) {
            this.locationList = this.treeConstructLoc(res);
            console.log(this.locationList,'locationListdrop');
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllCustodians() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Custodians/GetAllCustodians', { get: 1, dropDown: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CustodiansDtoResponse) => {
          if (res) {
            this.custodianList = res.data;
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  // getAllCategories() {
  //   this.fetchingData = true;
  //   this.tableDataService
  //     .getTableData('Category/GetAllCategoriesTreeView', {
  //       get: 1,
  //       searching: 0,
  //     })
  //     .pipe(
  //       first(),
  //       finalize(() => (this.fetchingData = false))
  //     )
  //     .subscribe({
  //       next: (res) => {
  //         if (res) {
  //           this.categoryList = res;
  //         } else {
  //           this.toast.show(res.message, 'error');
  //         }
  //       },
  //       error: (err) =>
  //         this.toast.show(err ?? 'Something went wrong!', 'error'),
  //     });
  // }
  getAllOrganizationHierarchy() {
    this.tableDataService
      .getTableData('OrgHier/GetAllOrgHier', { get: 1, searching: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.TREE_DATA_HIER = res;
            this.hierarchyList = this.treeConstructHier(this.TREE_DATA_HIER);
            console.log('tree data', this.hierarchyList);

          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllAssItems() {
    this.tableDataService
      .getTableDataWithPagination('Assets/GetAllAssetItems',{get: 1, paginationParam: {
        pageIndex: 1,
        pageSize: 10000,
      }})
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            console.log(res,'data');
            this.astItemDropdown = res.data.reverse();
          }
        },
      });
  }
  getAllAssets() {
    this.tableDataService
      .getTableDataGet('Assets/GetAllAssets')
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.astDropdown = res;
            this.astlist = res;
          }
        },
      });
  }
  getAllBrands() {
    this.tableDataService
      .getTableDataWithPagination('Brands/GetAllBrands', { get: 1, dropDown: 1})
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.brandList = res.data.reverse();
          }
        },
      });
  }

  getAllAddresses(currentPage: number, pageSize: number) {
    this.fetchingData = true;

    this.tableDataService
      .getTableDataWithPagination('Assets/SearchAssets', {
        get: 1,
        // searching: 1,
        astID: this.astID,
        astNum: this.astNum,
        itemCode: this.itemCode,
        serialNo: this.astDesc,
        astBrandID: this.astBrandID,
        astCatID: this.astCatID,
        locid: this.locid,
        orgHierID: this.orgHierID,
        custID: this.custodianID,
        paginationParam: {
        pageIndex: currentPage,
        pageSize: pageSize,
      }
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res:any) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.totalItems = res.totalRowsCount;
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  removeHandler(addressID: number) {
    this.confirmationDialogService.confirm().then((confirmed) => {
      if (confirmed) {
        this.sendingRequest = true;
        const payload = { addressID };
        this.tableDataService
          .getTableData('AddressTemplate/DeleteAddressTemplate', {
            delete: 1,
            ...payload,
          })
          .pipe(
            first(),
            finalize(() => (this.fetchingData = false))
          )
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success');
                this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
              } else {
                this.toast.show(res.message, 'error');
              }
            },
            error: (err) =>
              this.toast.show(err ?? 'Something went wrong!', 'error'),
          });
      }
    });
  }

  onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters: [
          {
            field: 'addressDesc',
            operator: 'contains',
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getAllAddresses(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
  handleFilterAstId(value: any) {
    console.log(value,'value');
    this.astDropdown = this.astlist.filter(
      (s:any) => (s.astID + '-' + s.astDesc ).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }



  ///// Tree DropDown Org hier/////
  get filterExpandSettings(): FilterExpandSettings {
    return { expandMatches: true };
  }

  TREE_DATA_HIER: FoodNodeFlat[] = [];

  public dataItem: { orgHierName: string; orgHierID: number }


  treeConstructHier(treeData: FoodNodeFlat[])
  {
    let constructedTree: never[] = [];
    for (let i of treeData)
    {
      let treeObj = i;
      let assigned = false;
      this.constructTreeHier(constructedTree, treeObj, assigned)
    }
    return constructedTree;
  }

  constructTreeHier(constructedTree: any, treeObj: FoodNodeFlat, assigned: boolean)
  {
    if (treeObj.parentId == "")
    {
      treeObj.children = [];
      constructedTree.push(treeObj);
      return true;
    } else if (treeObj.parentId == constructedTree.lvlCode)
    {
      treeObj.children = [];
      constructedTree.children.push(treeObj);
      return true;
    }
    else
    {
      if (constructedTree.children != undefined)
      {
        for (let index = 0; index < constructedTree.children.length; index++)
        {
          let constructedObj = constructedTree.children[ index ];
          if (assigned == false)
          {
            assigned = this.constructTreeHier(constructedObj, treeObj, assigned);
          }
        }
      } else
      {
        for (let index = 0; index < constructedTree.length; index++)
        {
          let constructedObj = constructedTree[ index ];
          if (assigned == false)
          {
            assigned = this.constructTreeHier(constructedObj, treeObj, assigned);
          }
        }
      }
      return false;
    }
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
////////////////////////// cat tree view drop ///////


  getAllCategories() {
    this.fetchingData = true
    this.tableDataService.getTableData('Category/GetAllCategoriesTreeView', { get: 1, searching: 0 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          if (res) {
             this.categoryList =this.treeConstruct(res);
            console.log(this.categoryList, 'tree data');


          } else {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  treeConstruct(treeData: GetAllCategoriesTreeView[])
  {
    let constructedTree: never[] = [];
    for (let i of treeData)
    {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned)
    }
    return constructedTree;
  }

  constructTree(constructedTree: any, treeObj: GetAllCategoriesTreeView, assigned: boolean)
  {
    // console.log('test', treeObj.catLevel, treeObj.astCatID, constructedTree.astCatID, 'new', treeObj.astCatID.slice(0, treeObj.astCatID.lastIndexOf('-')));
    if (treeObj.catLevel == 0)
    {
      treeObj.children = [];
      constructedTree.push(treeObj);
      return true;
    } else if (treeObj.astCatID.slice(0, treeObj.astCatID.lastIndexOf('-')) == constructedTree.astCatID)
    {
      treeObj.children = [];
      constructedTree.children.push(treeObj);
      return true;
    }
    else
    {
      if (constructedTree.children != undefined)
      {
        for (let index = 0; index < constructedTree.children.length; index++)
        {
          let constructedObj = constructedTree.children[ index ];
          if (assigned == false)
          {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      } else
      {
        for (let index = 0; index < constructedTree.length; index++)
        {
          let constructedObj = constructedTree[ index ];
          if (assigned == false)
          {
            assigned = this.constructTree(constructedObj, treeObj, assigned);
          }
        }
      }
      return false;
    }
  }
}

interface FoodNodeFlat
{
  compLvlCode: any;
  iD2: any;
  lvlCode: string;
  orgHierID: any;
  orgHierName: any;
  parentId: any;
  children?: FoodNodeFlat[];
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
interface GetAllCategoriesTreeView
{
  parentID: string;
  "astCatDesc": string,
  "astCatID": string,
  "catFullPath": boolean,
  "catLevel": number,
  "code": string,
  "compCode": string,
  "iD1": number,
  "isDeleted": string,
  children?: GetAllCategoriesTreeView[];
}
