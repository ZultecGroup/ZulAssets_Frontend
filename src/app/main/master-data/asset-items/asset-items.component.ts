import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  Subject,
  takeUntil,
} from 'rxjs';
import { toastService } from '../../shared/toaster/toast.service';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';
import {
  AssetItemsDto,
  AssetItemsDtoResponse,
} from '../../shared/dtos/AssetItems/AssetItemsDto';

@Component({
  selector: 'app-asset-items',
  templateUrl: './asset-items.component.html',
  styleUrls: ['./asset-items.component.scss'],
})
export class AssetItemsComponent implements OnInit {
  gridData: AssetItemsDto[] = [];
  gridView: AssetItemsDto[] = [];
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  searchText: string = '';
  searchSubject = new Subject<string>();
  assetItemsGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  isDestroyed$: Subject<boolean> = new Subject();
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [15, 30, 50, 100, 200, 500],
  };
  faFileExcel = faFileExcel;
  faFilePdf = faFilePdf;
  private gridApi!: GridApi;

  private actionCellService = inject(ActionCellService);
  private gridDataService = inject(GridDataService);
  BarcodeStructureView: any;
  barcodeStructureID: any;

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private route: ActivatedRoute,
    public GeneralService: GeneralService
  ) {
    this.assetItemsGridCols = this.gridDataService.getColumnDefs(
      GridType.AssetItems,
      this.GeneralService.permissions['Asset Items']
    );
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(
      queryParams['currentPage'] ?? this.pagination.currentPage
    );
    const pageSize = Number(
      queryParams['pageSize'] ?? this.pagination.pageSize
    );

    this.getAllSuppliers(currentPage, pageSize);
    this.GetAllBarcodeStructures();
    this.actionCellService.primaryClicked$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((data) => {
        if (data.gridName === GridType.AssetItems) {
          this.onEditClick(data.rowData.itemCode);
        }
      });
    this.actionCellService.secondaryClicked$
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((data) => {
        if (data.gridName === GridType.AssetItems) {
          this.removeHandler(data.rowData.itemCode);
        }
      });

    this.searchHandler();
  }

  private searchHandler() {
    this.searchSubject
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((term) => {
        this.searchText = term;
        this.getAllSuppliers(1, this.pagination.pageSize);
      });
  }

  ngOnDestroy() {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
  }

  getAllSuppliers(currentPage: number, pageSize: number) {
    this.fetchingData = true;

    let payload: any = {
      get: 1,
      paginationParam: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    };

    if (this.searchText !== '') {
      payload = {
        ...payload,
        searching: 1,
        var: this.searchText,
      };
    }

    this.tableDataService
      .getTableDataWithPagination('Assets/GetAllAssetItems', payload)
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: AssetItemsDtoResponse) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.currentPage = currentPage;
            this.pagination.pageSize = pageSize;
            this.pagination.totalItems = res.totalRowsCount;
            setTimeout(() => this.reapplySelection(), 0); // Reapply selection after the grid refresh
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  onEditClick(Id: number) {
    this.router.navigate(['edit', Id], {
      relativeTo: this.route,
      queryParams: {
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      },
    });
  }

  removeHandler(itemCode: number) {
    this.confirmationDialogService.confirm().then((confirmed) => {
      if (confirmed) {
        this.sendingRequest = true;
        const payload = { itemCode };
        this.tableDataService
          .getTableData('Assets/DeleteAssetItem', { delete: 1, ...payload })
          .pipe(
            first(),
            finalize(() => (this.fetchingData = false))
          )
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success');
                this.getAllSuppliers(
                  this.pagination.currentPage,
                  this.pagination.pageSize
                );
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.showLoadingOverlay();
  }

  onFilterTextBoxChanged() {
    this.searchSubject.next(this.searchText);
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    this.getAllSuppliers(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number) {
    this.resetPaginator();
    this.pagination.pageSize = event;
    this.getAllSuppliers(this.pagination.currentPage, this.pagination.pageSize);
  }

  private resetPaginator() {
    this.pagination.currentPage = 1;
    this.pagination.totalItems = 0;
  }

  exportToCSV(): void {
    this.gridDataService.exportToCSV(this.gridApi, GridType.AssetItems);
  }

  onSubmit() {
    if (this.barcodeStructureID) {
      this.sendingRequest = true;

      let itemTree: any = [];
      Array.from(this.selectedRowsMap.keys()).map((x: any) => {
        itemTree.push({
          itemCode: x,
        });
      });

      this.tableDataService
        .getTableData('BarcodeStructure/ApplyBarcodePolicyAgainstAssetItems', {
          barcodeStructureID: this.barcodeStructureID,
          itemCodeTree: itemTree,
        })
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success');
            } else {
              this.toast.show(res.message, 'error');
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error');
          },
        });
    }
  }

  GetAllBarcodeStructures() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('BarcodeStructure/GetAllBarcodeStructures', { get: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            //this.BarcodeStructure = res.reverse();
            this.BarcodeStructureView = res.data.reverse();
            console.log(this.BarcodeStructureView);
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  selectedRowsMap: Map<number, any> = new Map(); // Key is a unique identifier like rowNo or itemCodes

  onSelectionChanged() {
    const selectedNodes = this.gridApi.getSelectedNodes();

    // Add newly selected rows to the global map
    selectedNodes.forEach((node) => {
      if (node.data && node.data.itemCode) {
        this.selectedRowsMap.set(node.data.itemCode, node.data);
      }
    });

    // Remove rows no longer selected from the map
    const deselectedNodes = this.gridApi
      .getRenderedNodes()
      .filter((node) => !node.isSelected());
    deselectedNodes.forEach((node) => {
      if (node.data && node.data.itemCode) {
        this.selectedRowsMap.delete(node.data.itemCode);
      }
    });

    console.log(
      'Global Selected Rows Map:',
      Array.from(this.selectedRowsMap.values())
    );
  }

  reapplySelection() {
    this.gridApi.forEachNode((node) => {
      if (node.data && this.selectedRowsMap.has(node.data.itemCode)) {
        node.setSelected(true);
      }
    });
  }
}
