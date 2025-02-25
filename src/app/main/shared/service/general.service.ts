import { Injectable } from '@angular/core';
import { BehaviorSubject, first, ReplaySubject, Subject } from 'rxjs';
import { TableDataService } from './table-data.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public afterLoginLTR: Subject<string> = new Subject();
  public permissions: any = {}; // Store the transformed permissions
  loading = new BehaviorSubject<boolean>(false);
  roleAssignOptions: any;
  menus: any;

  constructor(public dataService: TableDataService) {
   }

   setLoading(loading: boolean)
  {
    this.loading.next(loading);
  }


  getRoleRightsByID() {
    this.dataService.getTableDataWithPagination('Roles/GetRoleByID', { get: 1, getByID: 1, roleID: (JSON.parse(localStorage.getItem('userObj') || 'null').roleID)})
      .pipe(
        first())
      .subscribe({
        next: (res: any) => {
          this.roleAssignOptions = res?.roleAssignOptions;
          this.menus = this.buildMenuList(res?.masterMenu, res?.menuOptions);
          console.log('this.menus data',this.menus);

          this.loadPermissions(this.menus);

        }
      })
      // return this.setPermissions(this.menus)
    }


buildMenuList(masterMenu: any[], menuOptions: any[]): any[] {
  const menuMap: { [key: number]: any } = {};

  // Create initial map for menus
  masterMenu.forEach((menu) => {
    menuMap[menu.menuID] = {
      menuName: menu.menuName,
      options: [],
    };
  });

  // Add options to corresponding menus
  menuOptions.forEach((option) => {
    if (menuMap[option.menuID]) {
      menuMap[option.menuID].options.push({
        id: option.optionID,
        text: option.optionName,
        checked: !!this.roleAssignOptions.find(
          (assign: any) =>
            assign.menuId === option.menuID &&
            assign.optionId === option.optionID &&
            assign.value === 1
        ),
      });
    }
  });

  // Return a flat list with hierarchical information
  return Object.values(menuMap);
}

loadPermissions(data: any): void {

  this.permissions = this.transformPermissions(data);
  console.log('this.permission data',this.permissions);

}

private transformPermissions(data: any): any {
  const permissionObject: any = {};

  data.forEach((entry: any) => {
    const { menuName, options } = entry;
    if (!permissionObject[menuName]) {
      permissionObject[menuName] = {};
    }

    options.forEach((option: any) => {
      permissionObject[menuName][option.text.toLowerCase()] = option.checked;
    });
  });
  permissionObject['Company Info'].delete = false;
  return permissionObject;
}

private preselectedNodesSource = new ReplaySubject<{ locID: string }[]>(1); // Cache the latest value
preselectedNodes$ = this.preselectedNodesSource.asObservable();

setPreselectedNodes(nodes: { locID: string }[]): void {
  this.preselectedNodesSource.next(nodes);
}
}
