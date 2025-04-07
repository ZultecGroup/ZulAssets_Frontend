import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms/forms';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { finalize, first, map } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';


import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl, NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {BehaviorSubject} from 'rxjs'
import { RolesDto, RolesDtoResponse } from 'src/app/main/shared/dtos/Roles/RolesDto';

export class UesrRoleItemNode {
  children: UesrRoleItemNode[];
  iconClass: string;
  menuId: any;
  parent: any;
  text: any;
  isChecked:boolean
}

/** Flat to-do item node with expandable and level information */
export class UserRoleItemFlatNode {
  iconClass: string;
  menuId: any;
  parent: any;
  text: any;
  level: number;
  expandable: boolean;
  isChecked:boolean
}

@Component({
  selector: 'app-add-update-roles',
  templateUrl: './add-update-roles.component.html',
  styleUrls: ['./add-update-roles.component.scss']
})
export class AddUpdateRolesComponent implements OnInit {

  userRoleForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  userRoleId!: number;
  fetchingData: boolean = false;

  public expandedKeys: any[] = ["0"];
  public checkedKeys: any[] = [];
  public checkedItems: any[] = [];
  public events: string[] = [];
  public selectedKeys: any[] = [];
  public enableCheck = true;
  public checkChildren = true;
  public checkDisabledChildren = false;
  public checkParents = true;
  public checkOnClick = false;
  public checkMode: any = "multiple";
  public selectionMode: any = "single";
  public data: any[] = []
  flatData: any
  @ViewChild('treeview')
  public tree: TreeViewComponent;
  // defined the array of data
  public roles: Object[] = [
  ];
  public selectedRoles: Object[] = [
  ];
  // maps the appropriate column to fields property
  public field: Object = { };
  // set the CheckBox to the TreeView
  public showCheckBox: boolean = true;
  //set the checknodes to the TreeView



  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }
  roleAssignOptions: any;
  menu: any[];
  menus: any[];


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: TableDataService, private toast: toastService,
    private router: Router,
    private tableDataService: TableDataService
  ) {


  }



  currentRoute:any
  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.userRoleId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.userRoleId;
    console.log(this.userRoleId);
    this.initializebrandForm();
    if (this.isEditMode) {
      this.getUserRoleById();
    this.getRoleRightsByID();

    }


  }


  // for crud operation
  getUserRoleById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
    }

    this.dataService.getTableDataWithPagination('Roles/GetAllRoles', { get: 1, paginationParam })
      .pipe(
        map((roleList: RolesDtoResponse) =>
          roleList.data.find((role: RolesDto) => role.roleID == this.userRoleId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.userRoleForm.patchValue({
            roleID: res?.roleID,
            description: res?.description
          })
        }
      })
  }
  initializebrandForm() {
    this.userRoleForm = this.fb.group({
      roleID: [0],
      description: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }
  onSubmit() {

      if (this.userRoleForm.valid) {
        this.sendingRequest = true
        let payload: any;
        payload = this.userRoleForm.value
        if(this.isEditMode){
          payload.update = 1;
          payload.roleID = String(this.userRoleId);
          this.saveChanges();
        }


        let userDetail: any = localStorage.getItem('userDetail')
        payload.loginName = JSON.parse(userDetail)?.userName
        const apiCall = this.isEditMode ?
        this.dataService.getTableData('Roles/UpdateRole', payload) :
         this.dataService.getTableData('Roles/InsertRole', { add: 1, ...this.userRoleForm.value });

        apiCall.pipe(first(),finalize(() => this.sendingRequest = false))
          .subscribe({
            next: (res) => {
              if(this.isEditMode && res && res.status == '200'){
                this.toast.show(res.message, 'success')
                this.router.navigate(['main/security/user-roles'])
              }
              else if (res && res[0].status == '200') {
                this.toast.show(res[0].message, 'success')
                this.router.navigate(['main/security/user-roles'])
              } else {
                this.toast.show(res.message, 'error')
              }
            },
            error: (err) => {
              console.log('errr',err);
              this.toast.show(err.title, 'error')
            }
          })
      }
      else {
        validateAllFormFields(this.userRoleForm)
      }

  }


  back()
  {
    this.router.navigate([ 'main/security/user-roles' ], this.isEditMode ? { queryParams: { currentPage: this.pagination.currentPage, pageSize: this.pagination.pageSize } } : undefined);
  }


  //////////////// rolex

getRoleRightsByID() {
    this.fetchingData = true;


    this.dataService.getTableDataWithPagination('Roles/GetRoleByID', { get: 1, getByID: 1, roleID: this.userRoleId })
      .pipe(
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.roleAssignOptions = res?.roleAssignOptions;
          this.menus = this.buildTree(res?.masterMenu, res?.menuOptions);

          console.log('this.treeData',this.menus);
        }
      })
  }


  buildTree(masterMenu: any[], menuOptions: any[]): any[] {
    const menuMap: { [key: number]: any } = {};
    const tree: any[] = [];

    masterMenu.forEach(menu => {
      menuMap[menu.menuID] = { ...menu, items: [], options: [] };
    });

    menuOptions.forEach(option => {
      if (menuMap[option.menuID]) {
        menuMap[option.menuID].options.push({
          id: option.optionID,
          text: option.optionName,
          checked: !!this.roleAssignOptions.find(
            (assign: any) =>
              assign.menuId === option.menuID &&
              assign.optionId === option.optionID &&
              assign.value === 1
          )
        });
      }
    });

    Object.values(menuMap).forEach(menu => {
      if (menu.parentId) {
        menuMap[menu.parentId].items.push(menu);
      } else {
        tree.push(menu);
      }
    });

    return tree;
  }


  gatherCheckedNodes(nodes: any[], parentId: number | null = null): any[] {
    const updates: any[] = [];
    nodes.forEach(node => {
      node.options?.forEach((option: any) => {
        updates.push({
          roleId: this.userRoleId,
          optionId: option.id,
          menuId: node.menuID,
          value: option.checked ? 1 : 0
        });
      });

      if (node.items && node.items.length) {
        updates.push(...this.gatherCheckedNodes(node.items, node.menuID));
      }
    });
    return updates;
  }

  saveChanges(): void {
    const payload = {
      update: 1,
      roleID: String(this.userRoleId),
      roleAssignOptions_list: this.gatherCheckedNodes(this.menus)
    };
    console.log('Payload to send:', payload);
    // Use an API call to send this payload

    this.dataService.getTableData('Roles/UpdateRoleRights', { add: 1, ...payload })
    .pipe(
      first(),
      finalize(() => this.sendingRequest = false))
          .subscribe({
            next: (res) => {
              if (res && res[0].status == '200') {
                this.toast.show(res[0].message, 'success')
              } else {
                this.toast.show(res.message, 'error')
              }
            },
            error: (err) => {
              console.log('errr',err);
              this.toast.show(err.title, 'error')
            }
          })
  }
}
