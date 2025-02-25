import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import { TreeData } from 'mat-tree-select-input';
import { map, first, finalize } from 'rxjs';
import { CustodiansDto, CustodiansDtoResponse } from 'src/app/main/shared/dtos/Custodians/CustodiansDto';
import { DesignationDtoResposne } from 'src/app/main/shared/dtos/Designations/DesignationDto';
import { emailRegex, noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-custodians',
  templateUrl: './add-update-custodians.component.html',
  styleUrls: ['./add-update-custodians.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class AddUpdateCustodiansComponent implements OnInit {

  custodianForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  custodianId!: string;
  fetchingData: boolean = false;
  allDesignation: any;
  hierarchyList: any;
  public data: Array<{ name: string; id: number }>;
  public dataForDesign: Array<{ name: string; id: number }>;
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router) { }

  ngOnInit(): void
  {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.custodianId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.custodianId;
    this.initializecustodianForm();
    this.getAllDesignation();
    this.getAllOrganizationHierarchy();
    if (this.isEditMode) {
      this.getCustodianById()
    }
  }
  getAllDesignation() {
    this.fetchingData = true
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }
    this.dataService.getTableDataWithPagination('Designation/GetAllDesignations', { get: 1, dropDown: 1, paginationParam })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: DesignationDtoResposne) => {
          if (res) {
            this.allDesignation = res.data.reverse()
            this.dataForDesign = this.allDesignation.slice()
            console.log(this.allDesignation,'kakjjdh')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  getCustodianById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }
    this.dataService.getTableDataWithPagination('Custodians/GetAllCustodians', { get: 1,searching: 1,var: this.custodianId, paginationParam })
      .pipe(
        map((custodianList: CustodiansDtoResponse) =>
          custodianList.data.find((custodian: CustodiansDto) => custodian.custodianID == this.custodianId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          console.log(res)
          this.custodianForm.patchValue({
            custodianID: res?.custodianID,
            custodianName: res?.custodianName,
            custodianCode: res?.custodianCode,
            custodianPhone: res?.custodianPhone,
            custodianEmail: res?.custodianEmail,
            custodianFax: res?.custodianFax,
            custodianCell: res?.custodianCell,
            custodianAddress: res?.custodianAddress,
            orgHierID: {value: res?.orgHierID,name: res?.orgHierName },
            designationID: res?.designationID
          })
        }
      })
  }

  initializecustodianForm() {
    this.custodianForm = this.fb.group({
      // custodianID: [''],
      custodianName: ['', [Validators.required, noWhitespaceValidator()]],
      custodianCode: ['', [Validators.required, noWhitespaceValidator()]],
      custodianPhone: ['', Validators.pattern(/^\d+$/)],
      custodianEmail: ['', Validators.pattern(emailRegex)],
      custodianFax: [''],
      custodianCell: ['', Validators.pattern(/^\d+$/)],
      custodianAddress: [''],
      orgHierID: {},
      designationID: ['']
    })
  }

  onSubmit() {
    if (this.custodianForm.valid) {
      this.sendingRequest = true
      if(this.isEditMode){
        this.custodianForm.value.custodianID = this.custodianId;
      }
      this.custodianForm.value.orgHierID = this.custodianForm.value.orgHierID.value;
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('Custodians/UpdateCustodian', { update: 1, ...this.custodianForm.value }) : this.dataService.getTableData('Custodians/InsertCustodian', { add: 1, ...this.custodianForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/custodians'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.custodianForm)
    }
  }

  handleFilter(value:any) {
    this.data = this.hierarchyList.filter(
      (s:any) =>s.orgHierName
      .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  get filterExpandSettings(): FilterExpandSettings {
    return { expandMatches: true };
  }


  handleFilterDesig(value:any) {
    this.dataForDesign = this.allDesignation.filter(
      (s:any) =>s.description
      .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  ///// Tree DropDown /////

  TREE_DATA: FoodNodeFlat[] = []
  dropDownData: TreeData[] = [];



  treeConstruct(treeData: FoodNodeFlat[])
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

  constructTree(constructedTree: any, treeObj: FoodNodeFlat, assigned: boolean)
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


  getAllOrganizationHierarchy() {
    this.dataService.getTableData('OrgHier/GetAllOrgHier', { get: 1, searching: 1 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          if (res) {
            this.TREE_DATA = res;
            this.treeConstruct(this.TREE_DATA);
            console.log('tree data', this.TREE_DATA);
            this.dropDownData = this.constructTreeDropDownData(this.TREE_DATA)
            console.log(this.dropDownData,'dropdown DATA');


          } else {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  constructTreeDropDownData(data:any){
    return data.map(

      (item:any)=>{
        console.log(item,'it');
        let o = {
          name: item.orgHierName,
          value: item.orgHierID,
          children: item.children.length ? this.constructTreeDropDownData(item.children) : []
        }
        return o
      }
    )
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

interface FlatNode
{
  expandable: boolean;
  level: any,
  iD2: any;
  lvlCode: string;
  orgHierID: any;
  orgHierName: any;
  parentId: any;
  children?: FoodNodeFlat[];
}
