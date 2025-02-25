import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { first, finalize, take, Subject, takeUntil } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { GridComponent } from '@progress/kendo-angular-grid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { noWhitespaceValidator, validateAllFormFields } from '../../shared/helper/functions.component';
import { PurchaseOrderDto } from '../../shared/dtos/PurchaseOrder/PurchaseOrderDto';
import { SuppliersDto, SuppliersDtoResponse } from '../../shared/dtos/Suppliers/SuppliersDto';
import { CustodiansDto, CustodiansDtoResponse } from '../../shared/dtos/Custodians/CustodiansDto';
import { CostCentersDto, CostCentersDtoResponse } from '../../shared/dtos/CostCenters/CostCentersDto';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';

@Component({
  selector: 'app-po-preparation',
  templateUrl: './po-preparation.component.html',
  styleUrls: [ './po-preparation.component.scss' ],
})
export class PoPreparationComponent implements OnInit
{
  fetchingData: boolean;
  poPreParationForm!: FormGroup;
  public pOList: any = [];
  selectedValue: any;
  opened: boolean = false;
  poCode: any;
  suppName: any;
  costID: any;
  referenceNo: any;
  preparedby: any;
  quotation: any;
  approvedby: any;
  requestedby: any;
  poStatus: any;
  poDate: any;
  amount: any;
  addCharges: any;
  discount: any;
  modeDelivery: any;
  payterm: any;
  remarks: any;
  termCondition: any;
  totalAmount: any;
  itemCodeBox: any;
  itemCostBox: any;
  addChargesBox: any;
  itemQuantityBox: any;
  unitBox: any;
  totalCostBox: any;

  @ViewChild('grid', { static: false }) grid!: GridComponent;
  searchString: any;
  allSupplier: SuppliersDto[] = [];
  allCostcenter: CostCentersDto[] = [];
  poItems: PurchaseOrderDto[] = [];
  CustodianData: CustodiansDto[] = [];
  sendingRequest: boolean;

  PoPreparationGridCols: ColDef[] = [];

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
  private actionCellService = inject(ActionCellService)
  private gridDataService = inject(GridDataService)
  gridApi: GridApi<any>;

  constructor(
    private ngZone: NgZone,
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
    private router: Router,
    public GeneralService: GeneralService
  )
  {
    this.PoPreparationGridCols = this.gridDataService.getColumnDefs(GridType.PoPreparation, this.GeneralService.permissions['PO Preparation']);
  }

  ngOnInit(): void
  {
    this.getAllPO();
    this.getAllSuppliers();
    this.getAllCostCenters();
    this.GetCustodian();
    this.initializeAssetForm();
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.PoPreparation)
      {
        this.removeHandler(data.rowData)
      }
    })
  }


  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  initializeAssetForm(data?: any)
  {
    this.poPreParationForm = this.fb.group({
      poCode: [ '' ],
      suppID: [ '', [Validators.required, noWhitespaceValidator()] ],
      poDate: [ '', [Validators.required, noWhitespaceValidator()] ],
      quotation: [ '', [Validators.required, noWhitespaceValidator()] ],
      amount: [ '', [Validators.required, noWhitespaceValidator()] ],
      addCharges: [ '', [Validators.required, noWhitespaceValidator()] ],
      modeDelivery: [ '', [Validators.required, noWhitespaceValidator()] ],
      payTerm: [ '', [Validators.required, noWhitespaceValidator()] ],
      remarks: [ '', [Validators.required, noWhitespaceValidator()] ],
      approvedBy: [ '', [Validators.required, noWhitespaceValidator()] ],
      preparedBy: [ '', [Validators.required, noWhitespaceValidator()] ],
      discount: [ '', [Validators.required, noWhitespaceValidator()] ],
      costID: [ '', [Validators.required, noWhitespaceValidator()] ],
      referenceNo: [ '', [Validators.required, noWhitespaceValidator()] ],
      poStatus: [ '', [Validators.required, noWhitespaceValidator()] ],
      requestedBy: [ '', [Validators.required, noWhitespaceValidator()] ],
      termNCon: [ '', [Validators.required, noWhitespaceValidator()] ],
      totalAmount: [ '', [Validators.required, noWhitespaceValidator()] ],
    });
  }

  ngAfterViewInit(): void
  {
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() =>
      {
        this.grid.autoFitColumns();
      });
  }
  setValues(event: any)
  {
    this.selectedValue = this.pOList.find(
      (x: { poCode: any }) => x.poCode == event
    );
    this.quotation = this.selectedValue.quotation;
    this.approvedby = this.selectedValue.approvedby;
    this.poStatus = this.selectedValue.poStatus;
    this.preparedby = this.selectedValue.preparedby;
    this.referenceNo = this.selectedValue.referenceNo;
    this.poDate = new Date(this.selectedValue.poDate);

    this.amount = this.selectedValue.amount;
    this.addCharges = this.selectedValue.addCharges;
    this.discount = this.selectedValue.discount;
    this.modeDelivery = this.selectedValue.modeDelivery;
    this.payterm = this.selectedValue.payterm;
    this.remarks = this.selectedValue.remarks;
    this.termCondition = this.selectedValue.termCondition;
    this.totalAmount =
      this.selectedValue.amount +
      this.selectedValue.addCharges -
      this.selectedValue.discount;

    this.suppName = this.allSupplier.find(
      (x: { suppName: any }) => x.suppName == this.selectedValue.suppName
    )?.suppName;
    this.requestedby = this.CustodianData.find(
      (x: { custodianID: any }) =>
        x.custodianID == this.selectedValue.requestedby
    )?.custodianID;
    this.costID = this.allCostcenter?.find(
      (x: { costID: any }) => x.costID == this.selectedValue.costID
    )?.costName;
    this.getAllPOItems(event);
  }
  close()
  {
    this.opened = false;
  }
  open()
  {
    this.opened = true;
  }
  Savedata()
  {
    this.poItems.push({
      addCharges: this.addChargesBox,
      itemCode: this.itemCodeBox,
      itemCost: this.itemCostBox,
      itemQuantity: this.itemQuantityBox,
      totalCost: this.totalCostBox,
      unitDesc: this.unitBox,
      poItmID: this.poItems.length + 1,
      rowNo: this.poItems.length + 1,
    });
    this.opened = false;
    this.gridApi.setRowData(this.poItems)
  }
  submit()
  {
    if (this.poPreParationForm.valid)
    {
      this.poPreParationForm.controls[ 'poStatus' ].setValue(1);
      this.sendingRequest = true;
      const apiCall$ = this.tableDataService.getTableData(
        'PO/InsertPOWithItems',
        {
          add: 1,
          ...this.poPreParationForm.value,
          poItemDetailsList: this.poItems,
        }
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) =>
        {
          if (res && res.status === '200')
          {
            this.toast.show(res.message, 'success');
            // this.setAllValues(this.astID, true);
            // this.router.navigate(['main/master-data/custodians'])
          } else
          {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
        {
          this.toast.show(err.title, 'error');
        },
      });
    } else
    {
      validateAllFormFields(this.poPreParationForm)
    }
  }
  getAllPOItems(poCode: number)
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('PO/GetAllPOItems', {
        get: 1,
        searching: 1,
        var: this.searchString,
        poCode: poCode,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: PurchaseOrderDto[]) =>
        {
          if (res)
          {
            this.poItems = res;
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllPO()
  {
    this.tableDataService
      .getTableData('PO/GetAllPurchaseOrders', { get: 1, searching: 0 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) =>
        {
          if (res)
          {
            this.pOList = res;
            // this.selectedValue=this.pOList[0].poCode;
          } else
          {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllSuppliers()
  {
    this.tableDataService
      .getTableData('Supplier/GetAllSuppliers', {
        get: 1,
        searching: 0,
        var: this.searchString,
      })
      .pipe(
        first(),
        finalize(() => { })
      )
      .subscribe({
        next: (res: SuppliersDtoResponse) =>
        {
          if (res)
          {
            this.allSupplier = res.data.reverse();
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  GetCustodian()
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Custodians/GetAllCustodians', {
        get: 1,
        searching: 1,
        var: this.searchString,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CustodiansDtoResponse) =>
        {
          if (res)
          {
            this.CustodianData = res.data.reverse();
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllCostCenters()
  {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('CostCenter/GetAllCostCenters', {
        get: 1,
        searching: 1,
        var: this.searchString,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CostCentersDtoResponse) =>
        {
          if (res)
          {
            this.allCostcenter = res.data.reverse();
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  clear()
  {
    this.poPreParationForm.reset();
    this.poItems = [];
  }
  removeHandler(data: any)
  {
    const objWithIdIndex = this.poItems.findIndex((obj) =>
    {
      return obj.poItmID === data.poItmID
    });

    if (objWithIdIndex > -1)
    {
      if (this.poItems.length > 1)
      {
        this.poItems.splice(objWithIdIndex, 1);
      }
    }
  }

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
