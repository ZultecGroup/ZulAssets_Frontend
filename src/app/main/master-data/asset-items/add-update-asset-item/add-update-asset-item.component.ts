import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import { TreeData } from 'mat-tree-select-input';
import { finalize, first, map } from 'rxjs';
import { AssetItemsDto, AssetItemsDtoResponse } from 'src/app/main/shared/dtos/AssetItems/AssetItemsDto';
import {  noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-asset-item',
  templateUrl: './add-update-asset-item.component.html',
  styleUrls: ['./add-update-asset-item.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class AddUpdateAssetItemComponent implements OnInit {

  assetItemForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  itemCode!: string;
  fetchingData: boolean = false;
  categoryList: any;
  public data: Array<{ name: string; id: number }>;

  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router) { }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.itemCode = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.itemCode;
    this.initializeassetItemForm();
    this.getAllCategories();
    if (this.isEditMode) {
      this.getSupplierById()
    }
  }

  getSupplierById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: 1,
      pageSize: 15000
    }
    this.dataService.getTableDataWithPagination('Designation/GetAllDesignations', { get: 1, paginationParam })
    this.dataService.getTableDataWithPagination('Assets/GetAllAssetItems', { get: 1,var: this.itemCode, searching: 1, paginationParam })
      .pipe(
        map((suppliersList: AssetItemsDtoResponse) =>
          suppliersList.data.find((supplier: AssetItemsDto) => supplier.itemCode == this.itemCode)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.assetItemForm.patchValue({
            itemCode: res?.itemCode,
            astCatID: {name: res?.catFullPath, value: res?.astCatID, path:res?.catFullPath},
            // astCatID: res?.astCatID,
            astDesc: res?.astDesc,
            imageBase64: res?.imageBase64 ? res?.imageBase64 : "",
            warranty: res?.warranty,
          })
          this.image = res?.imageBase64
        }
      })
  }

  initializeassetItemForm() {
    this.assetItemForm = this.fb.group({
      itemCode: [{ value: '', disabled: true }],
      astCatID: [null, Validators.required],
      astDesc: ['', [Validators.required, noWhitespaceValidator()]],
      imageBase64: [''],
      warranty: [0],
    })
  }

  onSubmit() {
    if (this.assetItemForm.valid) {
      this.sendingRequest = true

      console.log('this.assetItemForm.value',this.assetItemForm.value);

      // this.assetItemForm.value.astCatID = this.assetItemForm.value.astCatID.value;
      this.assetItemForm.controls['astCatID'].setValue(this.assetItemForm.value.astCatID.value)
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('Assets/UpdateAssetItem', { update: 1, ...this.assetItemForm.getRawValue() }) : this.dataService.getTableData('Assets/InsertAssetItem', { add: 1, ...this.assetItemForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/asset-items'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.assetItemForm)
    }
  }
  image: any = ''
  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const base64Image: string = e.target.result;
      this.image = base64Image;
      this.assetItemForm.patchValue({
        imageBase64: this.image
      })
      console.log(base64Image,'img'); // You can perform further operations with the base64 image
    };

    reader.readAsDataURL(file);
  }
  handleFilter(value:any) {
    this.data = this.categoryList.filter(
      (s:any) =>s.astCatDesc
      .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  get filterExpandSettings(): FilterExpandSettings {
    return { expandMatches: true };
  }

  ///////// tree dropdown   ////

  dropDownData: TreeData[] = [];
  TREE_DATA: GetAllCategoriesTreeViewNode[] = []



  getAllCategories() {
    this.fetchingData = true
    this.dataService.getTableData('Category/GetAllCategoriesTreeView', { get: 1, searching: 0 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          if (res) {
            this.TREE_DATA = res;
            this.treeConstruct(this.TREE_DATA);
            console.log(this.TREE_DATA, 'tree data');

            this.dropDownData = this.constructTreeDropDownData(this.TREE_DATA)
            console.log(this.constructTreeDropDownData(this.TREE_DATA),'constructTreeDropDownData')

          } else {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  treeConstruct(treeData: GetAllCategoriesTreeViewNode[])
  {
    let constructedTree: never[] = [];
    for (let i of treeData)
    {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned)
    }
    this.TREE_DATA = constructedTree;
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

  constructTreeDropDownData(data:any){
    return data.map(

      (item:any)=>{
        let o = {
          name: item.astCatDesc,
          value: item.astCatID,
          path: item.catFullPath,
          children: item.children.length ? this.constructTreeDropDownData(item.children) : []
        }
        return o
      }
    )
  }



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

interface GetAllCategoriesTreeViewNode
{
  parentID: string;
  expandable: boolean;
  level: any,
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
