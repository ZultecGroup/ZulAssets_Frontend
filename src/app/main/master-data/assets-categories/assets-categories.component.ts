import { GeneralService } from 'src/app/main/shared/service/general.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { toastService } from '../../shared/toaster/toast.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { debounceTime, distinctUntilChanged, finalize, first, Subject } from 'rxjs';
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

@Component({
  selector: 'app-assets-categories',
  templateUrl: './assets-categories.component.html',
  styleUrls: [ './assets-categories.component.scss' ]
})
export class AssetsCategoriesComponent implements OnInit
{
  fetchingData: boolean = false;
  @Input() categoriesupdate: boolean;
  @Output() AssestDetails = new EventEmitter();
  @Output() dropEvent = new EventEmitter<any>();

  opened: boolean = false;
  comcode: string;
  des: string;
  addSubnode: boolean = false;
  childData: any;
  private _transformer = (node: GetAllCategoriesTreeView, level: number) =>
  {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,
      astCatDesc: node.astCatDesc,
      astCatID: node.astCatID,
      catFullPath: node.catFullPath,
      catLevel: node.catLevel,
      code: node.code,
      compCode: node.compCode,
      iD1: node.iD1,
      isDeleted: node.isDeleted,
      parentID: node.parentID
    };
  }

  treeControl = new FlatTreeControl<GetAllCategoriesTreeViewNode>(
    node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  TREE_DATA: GetAllCategoriesTreeViewNode[] = []
  public editItem: any = null;
  sendingRequest: boolean = false;
  searchText: string = '';
  searchSubject = new Subject<string>();
  errorMessages: any;

  constructor(private tableDataService: TableDataService, private toast: toastService, private confirmationDialogService: ConfirmationDialogService , public GeneralService: GeneralService) { }

  ngOnInit(): void
  {
    this.GetAllCategoriesTreeView()
    if (this.categoriesupdate)
    {
      this.categoriesupdate = true;
    } else
    {
      this.categoriesupdate = false;
    }

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
      console.log('this.dataSource.data',this.dataSource.data);
      term ? this.treeControl.expandAll() : this.treeControl.collapseAll();
    });
  }

  private filterTree(nodes: any[], term: string): any[]
  {
    // console.log('yy',nodes, 'kk',term );
    return nodes
      .map(node => ({
        ...node,
        children: node.children ? this.filterTree(node.children, term) : [],
        matches: node.astCatDesc.toLowerCase().includes(term)
      }))
      .filter(node => node.matches || node.children.length > 0)
      .map(({ matches, ...rest }) => rest);
  }

  hasChild = (_: number, node: GetAllCategoriesTreeViewNode) => node.expandable;

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


  GetAllCategoriesTreeView()
  {
    this.fetchingData = true
    this.tableDataService.getTableData('Category/GetAllCategoriesTreeView', { get: 1 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {
          if (res)
          {
            this.TREE_DATA = res;
            this.dataSource.data = this.treeConstruct(this.TREE_DATA);
            console.log(this.dataSource.data)
          }
        }, error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })


  }
  showEditor(node: any)
  {
    this.errorMessages = {}
    this.editItem = node;
    console.log(this.editItem)
  }
  EditNode(node: any)
  {
    if(!this.validateField(node)){
      return
    }
    this.editItem = node;
    console.log(node);
    const apiCall$ = this.tableDataService.getTableData('Category/UpdateCategory', {
      update: 1, ...{
        catDesc: node.astCatDesc,
        catId: node.astCatID,
        catCode: node.code,
        parentId: node.parentID ? node.parentID : ""
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
  deleteChild(deletChild: any)
  {
    let catId = deletChild.astCatID
    this.confirmationDialogService.confirm()
      .then((confirmed) =>
      {
        if (confirmed)
        {
          this.sendingRequest = true;
          const payload = { catId }
          this.tableDataService.getTableData('Category/DeleteCategory', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) =>
              {
                if (res && res.status === '200')
                {
                  this.toast.show(res.message, 'success')
                  this.GetAllCategoriesTreeView()
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

  createNewItem()
  {
    return { AstCatDesc: String, AstCatCode: String, ParentId: String }
  }
  addNode()
  {
    this.errorMessages = {}
    this.opened = true;
    this.comcode = "";
    this.des = "";
  }
  addnewNode()
  {
    const node: any = this.createNewItem();
    node.AstCatDesc = this.des
    node.AstCatCode = this.comcode
    node.parentId = ""
    this.addAssestNode(node)
  }
  addAssestNode(node: any)
  {
    const apiCall$ = this.tableDataService.getTableData('Category/InsertCategor', {
      add: 1, ...{
        catDesc: node.AstCatDesc,
        catCode: node.AstCatCode,
        parentId: node.parentId
      }
    })
    apiCall$.pipe(finalize(() => this.sendingRequest = false))
      .subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            this.GetAllCategoriesTreeView();
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
          // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
        }
      })
  }
  getRandomInt(max: number)
  {
    return Math.floor(Math.random() * max);
  }
  addChild(node: any)
  {
    this.errorMessages = {}
    this.opened = true;
    this.addSubnode = true;
    this.childData = node;
  }
  addchildNewNode()
  {
    if (this.childData)
    {
      const apiCall$ = this.tableDataService.getTableData('Category/InsertCategor', {
        add: 1, ...{
          catDesc: this.des,
          catCode: this.comcode,
          parentId: this.childData.iD1,
          parentId2: this.childData.astCatID
        }
      })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.GetAllCategoriesTreeView();
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
            // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
          }
        })
    }
  }
  GetAssist(node: any)
  {
    this.AssestDetails.emit(node);
  }
  close()
  {
    this.opened = false;
    this.addSubnode = false;
  }
  Savedata()
  {
    if(this.validateFields()){
    if (!this.addSubnode && this.comcode && this.des)
    {
      this.addnewNode();
    }
    if (this.addSubnode && this.comcode && this.des)
    {
      this.addSubnode = false;
      this.addchildNewNode();
    }
    this.comcode = "";
    this.des = "";
    this.opened = false;
  }
  }

  onFilterTextBoxChanged()
  {
    this.searchSubject.next(this.searchText)
    // console.log(this.searchText);
  }

  // Allow dropping
  onDragOver(event: DragEvent) {
    // console.log('onDragOver loc', event);
    event.preventDefault(); // Enables the drop event
  }

  // Handle the drop event
  onDropEvent(event: DragEvent, targetNode: any) {
    event.preventDefault(); // Prevent browser default handling
    const droppedData = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
    // console.log('Dropped Data:', droppedData);
    const targetNodeElement = targetNode;
    this.dropEvent.emit({dropData: droppedData, targetData: targetNode, page:'Category'});
    // console.log('target Data:', targetNodeElement);
  }

  validateFields(): boolean {
    this.errorMessages = {};

    // Validate Code
    if (!this.comcode || this.comcode.trim() === '') {
      this.errorMessages.comcode = 'Code is required.';
    }

    // Validate Description
    if (!this.des || this.des.trim() === '') {
      this.errorMessages.des = 'Description is required.';
    }

    return Object.keys(this.errorMessages).length === 0;
  }
   // Validate the field and set error message if needed
  validateField(node: any) {
    console.log(node , 'ndoe');
    if (!node.astCatDesc || node.astCatDesc.trim() === '') {
      this.errorMessages.edit = 'This field is required.';
    }else{
      this.errorMessages = {}
    }

    return Object.keys(this.errorMessages).length === 0;

  }
}
