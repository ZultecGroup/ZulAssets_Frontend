import { GeneralService } from './../../../shared/service/general.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { DetailMaintenanceService } from '../detail-maintenance.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { ConfirmationDialogService } from 'src/app/main/shared/service/confirmation-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { GridType } from 'src/app/main/shared/dtos/GridType/GridType';
import { ActionCellService } from 'src/app/main/shared/service/action-cell.service';
import { GridDataService } from 'src/app/main/shared/service/grid-data.service';
import { DisposalOrSaleDto, DisposalOrSaleDtoResponse } from 'src/app/main/shared/dtos/DisposalOrSaleInfo/DisposalOrSaleDto';

@Component({
  selector: 'app-disposal-or-sales-information',
  templateUrl: './disposal-or-sales-information.component.html',
  styleUrls: ['./disposal-or-sales-information.component.scss']
})
export class DisposalOrSalesInformationComponent implements OnInit {
  @Input() detailsMaintenanceData: any;

  public dataDisposal: DisposalOrSaleDto[] = []
  sendingRequest: boolean;

  disposalOrSalesInfoGridCols: ColDef[] = [];

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
  astID: any;
  assetInfo: any;
  dispDate: any;
  disposalComments: any;
  disposed: boolean = false;


  constructor(
    public detailMaintenanceService : DetailMaintenanceService,
    public tableDataService : TableDataService,
    private toast: toastService,private fb: FormBuilder,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router, private route: ActivatedRoute,
    public generalService: GeneralService
  ) {
    this.disposalOrSalesInfoGridCols = this.gridDataService.getColumnDefs(GridType.DisposalOrSalesInfo, this.generalService.permissions['Detail & Maintenance']);
  }

  dispCode: any;
  dispDesc: any;
  allDisposalMethod: DisposalOrSaleDto[] = []
  fetchingData: boolean = false;
  isDisposed: boolean = true;
  isEditMode: any =false;
  searchString= ''
  disposalMethodForm!: FormGroup;

  ngOnInit(): void {
    if (this.detailsMaintenanceData != undefined) {
      this.assetInfo =this.detailsMaintenanceData.assetInformationExtendentedInformation[0];
      if (this.assetInfo != undefined) {
      this.astID = this.assetInfo.astID
      this.dispCode = this.assetInfo.dispCode
      this.dispDate = new Date(this.assetInfo.dispDate)
      this.disposalComments = this.assetInfo.disposalComments
      this.disposed = this.assetInfo.disposed

      }
    }
    this.disposalMethodForm = this.fb.group({
      dispCode: ['', [Validators.required, noWhitespaceValidator()]],
      dispDate: ['', [Validators.required, noWhitespaceValidator()]],
      disposalComments: ['', [Validators.required, noWhitespaceValidator()]],
      disposed: [true],
    })
    this.GetAllDispMethods();
  }

  ngOnDestroy() {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  GetAllDispMethods() {
    this.fetchingData = true

    this.tableDataService.getTableData('DisposalMethod/GetAllDispMethods', { get: 1, dropDown: 1})
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: DisposalOrSaleDtoResponse) => {
          if (res) {
            this.allDisposalMethod = res.data;
            this.dataDisposal=this.allDisposalMethod.slice();
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }



  submit() {
    if (this.disposalMethodForm.valid) {
      this.sendingRequest = true;
      const apiCall$ =this.tableDataService.getTableData('Assets/UpdateAssetDetails', { update: 1, astID:this.astID, ...this.disposalMethodForm.value })
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.GetAllDispMethods();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.disposalMethodForm)
    }
  }
  handleDisposal(value:any) {
    this.dataDisposal = this.allDisposalMethod.filter(
      (s:any) =>s.dispDesc
      .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }


  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    this.GetAllDispMethods();
  }

  pageSizeChange(event: number) {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.GetAllDispMethods()
  }

  private resetPaginator() {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
