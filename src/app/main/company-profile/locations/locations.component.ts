import { GeneralService } from 'src/app/main/shared/service/general.service';
import
{
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { debounceTime, distinctUntilChanged, finalize, first, Subject } from 'rxjs';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import
{
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { CompanyDtoResponse } from '../../shared/dtos/Companies/companyDtos';
import { CdkDragDrop } from '@angular/cdk/drag-drop';


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

interface FlatNode
{
  expandable: boolean;
  level: any;
  parentID: string;
  locID: string;
  locDesc: string;
  isDeleted: boolean;
  iD1: number;
  code: string;
  compCode: string;
  locationFullPath: string;
  companyID: number;
  locLevel: number;
  children: any;
}

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: [ './locations.component.scss' ],
})
export class LocationsComponent implements OnInit
{
  @Input() locationupdate: boolean;
  @Input() isInvantory: boolean = false;
  @Output() locationDetails = new EventEmitter();
  @Output() invtorySelectedLocations = new EventEmitter();
  @Output() dropEvent = new EventEmitter<any>();
  @Output() treeReady = new EventEmitter<void>();
  gridData: any[] = [];
  gridView: any[] = [];
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  TREE_DATA: LocationNodeFlat[] = [];
  public editItem: any = null;
  selected: any;
  allCompanyData: any[] = [];
  comcode: string;
  des: string;
  addedNode = false;
  childData: any;
  private _transformer = (node: LocationNodeFlat, level: number) =>
  {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,
      parentID: node.parentid,
      locID: node.locID,
      locDesc: node.locDesc,
      isDeleted: node.isDeleted,
      iD1: node.iD1,
      code: node.code,
      compCode: node.compCode,
      locationFullPath: node.locationFullPath,
      companyID: node.companyID,
      locLevel: node.locLevel,
      children: node.children,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  opened: boolean = false;
  searchText: string = '';
  searchSubject = new Subject<string>();
  errorMessages: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: TableDataService,
    private toast: toastService,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService,
    public GeneralService: GeneralService
  ) { }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  treeConstruct(treeData: LocationNodeFlat[])
  {
    let constructedTree: never[] = [];
    for (let i of treeData)
    {
      let treeObj = i;
      let assigned = false;
      if (treeObj)
      {
        this.constructTree(constructedTree, treeObj, assigned);
      }
    }
    this.gridData = constructedTree;
    return constructedTree;
  }

  constructTree(
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
      // console.log(constructedTree.children, "here")
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

  ngOnInit(): void
  {
    this.getAllLocations();
    this.getAllCompanies();
    if (this.locationupdate)
    {
      this.locationupdate = true;
    } else
    {
      this.locationupdate = false;
    }

    this.searchHandler();
    this.GeneralService.preselectedNodes$.subscribe(nodes => {
      if (nodes) {
        this.populatePreselectedNodes(nodes);
      }
    });
  }

  private searchHandler()
  {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(term =>
    {
      term = term.toLowerCase();
      this.dataSource.data = term ? this.filterTree(this.gridData, term) : this.gridData;
      term ? this.treeControl.expandAll() : this.treeControl.collapseAll();
    });
  }

  private filterTree(nodes: any[], term: string): any[]
  {
    return nodes
      .map(node => ({
        ...node,
        children: node.children ? this.filterTree(node.children, term) : [],
        matches: node.locDesc.toLowerCase().includes(term)
      }))
      .filter(node => node.matches || node.children.length > 0)
      .map(({ matches, ...rest }) => rest);
  }

  public getAllLocations()
  {
    this.fetchingData = true;
    //this.dataService.getTableDataGet('Locations/GetAllLocations')
    this.dataService
      .getTableData('Locations/GetAllLocationsTreeView', {
        get: 1,
        searching: 1,
        var: this.searchText,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) =>
        {
          if (res)
          {
            this.gridData = res;
            // this.gridView = this.gridData;
            // this.TREE_DATA = this.gridView;
            this.dataSource.data = this.treeConstruct(this.gridData);
            console.log(this.dataSource.data);
            this.treeReady.emit();
          } else
          {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  deleteChild(deletChild: any)
  {
    let locId = deletChild.locID;
    this.confirmationDialogService.confirm().then((confirmed) =>
    {
      if (confirmed)
      {
        this.sendingRequest = true;
        const payload = { locId };
        this.dataService
          .getTableData('Locations/DeleteLocation', { delete: 1, ...payload })
          .pipe(
            first(),
            finalize(() => (this.fetchingData = false))
          )
          .subscribe({
            next: (res) =>
            {
              if (res && res.status === '200')
              {
                this.toast.show(res.message, 'success');
                this.getAllLocations();
              } else
              {
                this.toast.show(res.message, 'error');
              }
            },
            error: (err) =>
              this.toast.show(err ?? 'Something went wrong!', 'error'),
          });
      }
    });
  }
  EditNode(node: any)
  {
    if(!this.validateField(node)){
      return
    }
    this.editItem = node;
    const apiCall$ = this.dataService.getTableData('Locations/UpdateLocation', {
      update: 1, ...{
        locCode: node.code,
        locDesc: node.locDesc,
        parentId: node.parentID,
        companyId: node.companyID,
        locId: node.locID,
      }
    })
    apiCall$.pipe(finalize(() => this.sendingRequest = false))
      .subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            this.editItem = '';
            this.toast.show(res.message, 'success');
            // this.router.navigate(['main/master-data/organization-hierarchy'])
          } else
          {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
        {
          this.toast.show(err.title, 'error');
          this.editItem = '';
          // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
        },
      });
  }
  showEditor(node: any)
  {
    this.editItem = node;
  }
  createNewItem()
  {
    return { locDesc: '', parentId: '', parentId2: '', companyId: '', locID: '', companyCode: '' }
  }
  onClick()
  {
  this.errorMessages = {};
    this.opened = true;
    this.comcode = "";
    this.des = "";
    this.selected = undefined
  }
  addnodes()
  {
    const node: any = this.createNewItem();
    node.companyId = this.selected.companyId;
    node.parentId = ""
    node.ParentID2 = ""
    node.locDesc = this.des
    node.LocCode = this.comcode
    node.companyCode = this.selected.companyCode;
    this.AddNode(node)
  }
  addChild(childAdd: any)
  {
  this.errorMessages = {};
    this.childData = childAdd;
    this.addedNode = true;
    this.opened = true;
    // this.comcode = childAdd.code;
    // this.des = childAdd.locDesc;
    // this.selected = this.allCompanyData.find(x => x.companyId === childAdd.companyID)
  }

  addNodeChild()
  {
    if (this.childData)
    {
      const node: any = this.createNewItem();
      node.locDesc = this.des;
      node.parentId = this.childData.iD1;
      node.companyId = this.childData.companyID;
      node.parentId2 = this.childData.locID
      node.locID = this.childData.locID,
        node.LocCode = this.childData.code
      this.AddChildNode(node)
    }
    this.addedNode = false;
  }

  AddNode(node: { companyId: any; parentId: any; parentId2: any; locDesc: any; LocCode: any; companyCode: any; })
  {
    const apiCall$ = this.dataService.getTableData('Locations/InsertLocation', {
      add: 1, ...{
        "companyId": node.companyId,
        "parentId": node.parentId,
        "parentId2": node.parentId2,
        "locDesc": node.locDesc,
        "LocCode": node.LocCode,
        "compCode": node.companyCode,
      }
    })
    apiCall$.pipe(finalize(() => this.sendingRequest = false))
      .subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            this.getAllLocations();
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

  AddChildNode(node: { locDesc: any; parentId: any; parentId2: any; companyId: any; LocCode: any; })
  {
    const apiCall$ = this.dataService.getTableData('Locations/InsertLocation', {
      add: 1, ...{
        "locDesc": node.locDesc,
        "parentId": node.parentId,
        "parentId2": node.parentId2,
        "companyId": node.companyId,
        "LocCode": node.LocCode
      }
    })
    apiCall$.pipe(finalize(() => this.sendingRequest = false))
      .subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            this.getAllLocations();
            this.toast.show(res.message, 'success')
            // this.router.navigate(['main/master-data/organization-hierarchy'])
          } else
          {
            this.toast.show(res.message, 'error')
          }
        }, error: (err) =>
        {
          this.toast.show(err.title, 'error');
          // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
        },
      });
  }

  getAllCompanies()
  {
    this.fetchingData = true;
    this.dataService
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
            this.allCompanyData = res.data.reverse().slice();
            console.log(this.allCompanyData)
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getLocation(node: any)
  {
    this.locationDetails.emit(node);
  }
  onDrop(event: CdkDragDrop<any[]>) {
    console.log(event, 'location event');
    this.dropEvent.emit(event);
  }

  // openSearchDialog() {
  //   this.opened = true;
  // }

  public close(): void
  {
    this.opened = false;
    this.addedNode = false;
  }
  Savedata()
  {
    if(this.validateFields()){
    if (!this.addedNode && this.comcode && this.selected && this.des)
    {
      this.addnodes();
    }
    if (this.addedNode && this.comcode && this.selected && this.des)
    {
      this.addNodeChild();
    }
    this.onClick();
    this.opened = false;
  }
  }

  onFilterTextBoxChanged()
  {
    this.searchSubject.next(this.searchText)
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
    this.dropEvent.emit({dropData: droppedData, targetData: targetNode, page:'Location'});
    // console.log('target Data:', targetNodeElement);
  }

  selectedLeafNodes: LocationNodeFlat[] = [];
  selectedNodesMap: Map<string, LocationNodeFlat> = new Map(); // Tracks all selected nodes for hierarchy validation

/** Check if the node is selected */
isNodeSelected(node: LocationNodeFlat): boolean {
  return this.selectedNodesMap.has(node.locID);
}

/** Check if the node is indeterminate */
isNodeIndeterminate(node: LocationNodeFlat): boolean {
  if (!node.children || node.children.length === 0) {
    return false;
  }
  const selectedChildren = node.children.filter(child => this.selectedNodesMap.has(child.locID));
  return selectedChildren.length > 0 && selectedChildren.length < node.children.length;
}

/** Handle node selection */
onNodeToggle(node: LocationNodeFlat, isSelected: boolean): void {
  if (isSelected) {
    this.selectNodeAndParents(node); // Select node and its parents
    this.selectNodeAndChildren(node); // Select node and its children
  } else {
    this.deselectNodeAndChildren(node); // Deselect node and its children
    this.updateParentSelection(node); // Update parent nodes based on remaining children
  }
  this.updateSelectedLeafNodes(); // Update selected leaf nodes for display
}

/** Select a node and all its parents */
private selectNodeAndParents(node: LocationNodeFlat): void {
  this.selectedNodesMap.set(node.locID, node); // Add the node to the selected map

  // Find parent node recursively (by traversing the hierarchy)
  const parentNode = this.findParentNode(node);
  if (parentNode) {
    this.selectNodeAndParents(parentNode); // Recursively select parent nodes
  }
}

/** Select a node and all its children */
private selectNodeAndChildren(node: LocationNodeFlat): void {
  this.selectedNodesMap.set(node.locID, node); // Add the node to the selected map

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => this.selectNodeAndChildren(child)); // Recursively select child nodes
  }
}

/** Deselect a node and all its children */
private deselectNodeAndChildren(node: LocationNodeFlat): void {
  this.selectedNodesMap.delete(node.locID); // Remove the node from the selected map

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => this.deselectNodeAndChildren(child)); // Recursively deselect child nodes
  }
}

/** Update the parent node selection based on its children */
private updateParentSelection(node: LocationNodeFlat): void {
  const parentNode = this.findParentNode(node);

  if (parentNode && parentNode.children != undefined) {
    // Check if any of the parent's children are still selected
    const hasSelectedChildren = parentNode.children.some(child => this.selectedNodesMap.has(child.locID));

    if (!hasSelectedChildren) {
      this.selectedNodesMap.delete(parentNode.locID); // Deselect the parent if no children are selected
      this.updateParentSelection(parentNode); // Recursively update the parent's parent
    }
  }
}

/** Update the selected leaf nodes for display */
private updateSelectedLeafNodes(): void {
  // Filter selected nodes to include only leaf nodes (nodes without children)
  this.selectedLeafNodes = Array.from(this.selectedNodesMap.values()).filter(node => !node.children || node.children.length === 0);
  this.invtorySelectedLocations.emit(this.selectedLeafNodes);
}

/** Find the parent node of a given node */
private findParentNode(node: LocationNodeFlat): LocationNodeFlat | null {
  for (const root of this.dataSource.data) {
    const parent = this.findParentRecursive(root, node);
    if (parent) {
      return parent;
    }
  }
  return null;
}

/** Recursively search for the parent of a node */
private findParentRecursive(current: LocationNodeFlat, target: LocationNodeFlat): LocationNodeFlat | null {
  if (current.children && current.children.some(child => child.locID === target.locID)) {
    return current; // Return parent node if found
  }

  if (current.children && current.children.length > 0) {
    for (const child of current.children) {
      const result = this.findParentRecursive(child, target);
      if (result) {
        return result;
      }
    }
  }

  return null; // Return null if no parent is found
}

/** Populate the tree with preselected nodes */
populatePreselectedNodes(locTrees: { locID: string }[]): void {
  // Step 1: Parse input and mark the corresponding nodes as selected
  locTrees.forEach(item => {
    const node = this.findNodeById(this.dataSource.data, item.locID); // Find node by locID
    if (node) {
      this.selectNodeAndParents(node); // Mark the node and its parents as selected
    }
  });

  // Step 2: Update the selected leaf nodes for display
  this.updateSelectedLeafNodes();
}

/** Find a node in the tree by its locID */
private findNodeById(nodes: LocationNodeFlat[], locID: string): LocationNodeFlat | null {
  for (const node of nodes) {
    if (node.locID === locID) {
      return node; // Return node if locID matches
    }
    if (node.children && node.children.length > 0) {
      const result = this.findNodeById(node.children, locID); // Recursively search in children
      if (result) {
        return result;
      }
    }
  }
  return null; // Return null if no node is found
}

validateFields(): boolean {
  this.errorMessages = {};

  // Validate Code
  if (!this.comcode || this.comcode.trim() === '') {
    this.errorMessages.comcode = 'Code is required.';
  }
  // Validate select
  if (!this.selected) {
    this.errorMessages.selected = 'Company is required.';
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
  if (!node.locDesc || node.locDesc.trim() === '') {
    this.errorMessages.edit = 'This field is required.';
  }else{
    this.errorMessages = {}
  }

  return Object.keys(this.errorMessages).length === 0;

}

}

