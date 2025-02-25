import { GeneralService } from 'src/app/main/shared/service/general.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { debounceTime, distinctUntilChanged, first, finalize, Subject } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { OrganizationLevelsDto, OrgLevelsDtoResponse } from '../../shared/dtos/OrganizationLevels.ts/OrganizationLevel';

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


@Component({
  selector: 'app-organization-hierarchy',
  templateUrl: './organization-hierarchy.component.html',
  styleUrls: [ './organization-hierarchy.component.scss' ]
})
export class OrganizationHierarchyComponent implements OnInit
{
  TREE_DATA: FoodNodeFlat[] = []
  public editItem: any = null;
  sendingRequest: boolean = false;
  fetchingData: boolean = false;
  searchString = '';
  selected: any;
  gridData: OrganizationLevelsDto[] = [];
  gridView: OrganizationLevelsDto[] = []
  opened: boolean = false;
  des: any;
  addParentNode = false;
  parentNode: any;
  private _transformer = (node: FoodNodeFlat, level: number) =>
  {
    return {
      expandable: !!node.children && node.children.length > 0,
      iD2: node.iD2,
      level: level,
      lvlCode: node.lvlCode,
      orgHierID: node.orgHierID,
      orgHierName: node.orgHierName,
      parentId: node.parentId,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  searchText: string = '';
  searchSubject = new Subject<string>();
  level: any;

  constructor(private tableDataService: TableDataService, private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService, public GeneralService: GeneralService)
  {
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

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


  public count: number = 0;
  createNewItem()
  {
    this.count++;
    return { orgHierID: this.count + "parent", orgHierName: this.des, lvlCode: this.selected.lvlID, parentId: "" }
    //{ name: this.count+"New Folder", Id: this.count, parentId:null };
  }
  public onClick()
  {
    this.addParentNode = false;
    this.opened = true;
    this.des = '';
    this.selected = undefined
    this.gridView = this.gridData.reverse();

    this.gridView = this.gridView.filter(function( obj ) {
      return obj.lvlID  == 1 ;
  });
  }


  addNodeOrganizationHierarchy(node: { orgHierName: any; lvlCode: any; parentId: any; })
  {
    const apiCall$ = this.tableDataService.getTableData('OrgHier/InsertOrgHier', {
      add: 1, ...{
        orgHierName: node.orgHierName,
        lvlID: node.lvlCode,
        parentId: node.parentId,

      }
    })
    apiCall$.pipe(finalize(() => this.sendingRequest = false))
      .subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            // this.getAllOrganizationHierarchy()
            this.toast.show(res.message, 'success')
            this.getAllOrganizationHierarchy();


            // this.router.navigate(['main/master-data/organization-hierarchy'])
          } else
          {
            // this.getAllOrganizationHierarchy();
            this.toast.show(res.message, 'error')
            this.getAllOrganizationHierarchy();


          }
        },
        error: (err) =>
        {
          this.toast.show(err.title, 'error')
          this.getAllOrganizationHierarchy();

          // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
        }
      })
  }

  addChild(parent: any)
  {
    this.opened = true;
    this.parentNode = parent;
    this.addParentNode = true;
    this.level = parent.level;
    this.gridView = this.gridData.reverse();
  console.log(this.level,'level');

    this.gridView = this.gridView.filter(function( obj ) {
      return obj.lvlID  == parent.level +2 ;
  });
  console.log(this.gridView,'gridView');


  }

  showEditor(node: any)
  {
    this.editItem = node;
    console.log(this.editItem)
  }

  editOrganizationHierarchy(node: any)
  {
    this.editItem = node;
    let orgHierID = node.orgHierID
    const apiCall$ = this.tableDataService.getTableData('OrgHier/UpdateOrgHier', {
      update: 1, ...{
        orgHierName: node.orgHierName,
        lvlCode: node.lvlCode,
      }
    })
    apiCall$.pipe(finalize(() => this.sendingRequest = false))
      .subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            this.editItem = "";
            this.toast.show(res.message, 'success')
            // this.router.navigate(['main/master-data/organization-hierarchy'])
          } else
          {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) =>
        {
          this.toast.show(err.title, 'error')
          this.editItem = "";
          // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
        }
      })
  }
  deleteOrganizationHierarchy(deletChild: any)
  {
    // let orgHierID = deletChild
    let orgHierID = deletChild.orgHierID
    this.confirmationDialogService.confirm()
      .then((confirmed) =>
      {
        if (confirmed)
        {
          // this.fetchingData = true;
          this.sendingRequest = true;
          const payload = { orgHierID}
          this.tableDataService.getTableData('OrgHier/DeleteOrgHier', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) =>
              {
                if (res && res.status === '200')
                {
                  this.toast.show(res.message, 'success')
                  this.getAllOrganizationHierarchy();

                } else
                {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      })
  }
  ngOnInit(): void
  {
    this.getAllOrganizationHierarchy()
    this.getAllLevels();

    this.searchHandler();
  }

  private searchHandler()
  {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(term =>
    {
      term = term.toLowerCase();
      this.dataSource.data = term ? this.filterTree(this.TREE_DATA, term) : this.TREE_DATA;
      term ? this.treeControl.expandAll() : this.treeControl.collapseAll();
    });
  }

  private filterTree(nodes: any[], term: string): any[]
  {
    return nodes
      .map(node => ({
        ...node,
        children: node.children ? this.filterTree(node.children, term) : [],
        matches: node.orgHierName.toLowerCase().includes(term)
      }))
      .filter(node => node.matches || node.children.length > 0)
      .map(({ matches, ...rest }) => rest);
  }

  getAllLevels()
  {
    this.fetchingData = true
    this.tableDataService.getTableData('Levels/GetAllLevels', { get: 1, searching: 1, var: this.searchString })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: OrgLevelsDtoResponse) =>
        {
          if (res)
          {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            console.log(this.gridView)
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
  getAllOrganizationHierarchy()
  {
    this.fetchingData = true
    this.tableDataService.getTableData('OrgHier/GetAllOrgHier', { get: 1 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {
          if (res)
          {
            this.TREE_DATA = res;
            this.dataSource.data = this.treeConstruct(this.TREE_DATA);
            console.log(this.dataSource.data, 'respond');
          }
        }, error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
      this.selected = null;
      this.des = null;
      this.addParentNode = false;
      this.opened = false;
  }
  close()
  {
    this.opened = false;
  }
  Savedata()
  {
    if (this.addParentNode && this.selected && this.des)
    {
      const node: any = this.createNewItem();
      node.parentId = this.parentNode.lvlCode,
        this.TREE_DATA.push(node)
      // this.dataSource.data = this.treeConstruct(this.TREE_DATA);
      this.addNodeOrganizationHierarchy(node);
    }
    if (!this.addParentNode && this.selected && this.des)
    {
      const node: any = this.createNewItem();
      this.addNodeOrganizationHierarchy(node)

    }
    this.selected = null;
    this.des = null;
    this.addParentNode = false;
    this.opened = false;
  }

  onFilterTextBoxChanged()
  {
    this.searchSubject.next(this.searchText)
  }
}
