import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { finalize, first, Subject, take } from 'rxjs';
import { TableDataService } from '../../shared/service/table-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { toastService } from '../../shared/toaster/toast.service';
import { noWhitespaceValidator, validateAllFormFields } from '../../shared/helper/functions.component';
import { CompanyDtoResponse } from '../../shared/dtos/Companies/companyDtos';
import { Router, ActivatedRoute } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';
import { DepreciationEngineDto, DepreciationEngineDtoResponse } from '../../shared/dtos/DepreciationEngine/DepreciationEngineDto';

@Component({
  selector: 'app-depreciation-engine',
  templateUrl: './depreciation-engine.component.html',
  styleUrls: [ './depreciation-engine.component.scss' ]
})
export class DepreciationEngineComponent implements OnInit
{
  @ViewChild('grid', { static: false }) grid!: GridComponent;
  depForm!: FormGroup;
  fetchingData: boolean;
  allCompanies: any;
  allDepreciationEngine: DepreciationEngineDto[] = [];
  sendingRequest: boolean;
  searchString: string | null;
  depreciationEngineGridCols: ColDef[] = [];
  isRowSelected: boolean = false; // Track selection state

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
  private gridApi!: GridApi;

  private gridDataService = inject(GridDataService)
  companyId: number = 0;

  constructor(private fb: FormBuilder, private ngZone: NgZone, public tableDataService: TableDataService, private toast: toastService,
    private router: Router, private route: ActivatedRoute, public GeneralService: GeneralService
  )
  {
    this.depreciationEngineGridCols = this.gridDataService.getColumnDefs(GridType.DepreciationEngine, this.GeneralService.permissions['Depreciation Engine']);
  }


  ngOnInit(): void
  {
    this.getAllCompanies();
    this.initializeForm();
    this.getDepreciationEngine(this.companyId, this.pagination.currentPage, this.pagination.pageSize);

  }

  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  onSelectionChanged() {
    this.isRowSelected = this.gridApi.getSelectedRows().length > 0;
  }
  getDepreciationEngine(company: number, pageNumber: number, pageSize: number)
  {
    this.isRowSelected = false;
    this.companyId = company;
    this.fetchingData = true
    let paginationParam = {
      pageIndex: pageNumber,
      pageSize: pageSize,
    }
    this.tableDataService.getTableDataWithPagination('DepreciationMethod/GetAstBooksAgainstCompanyIDForDepreciation', { get: 1, companyID: company, paginationParam })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: DepreciationEngineDtoResponse) =>
        {
          if (res)
          {
            this.allDepreciationEngine = res.data;
            this.pagination.totalItems = res.totalRowsCount
          }
        },
        error: (err) => { }
      })
  }
  initializeForm(data?: any)
  {
    this.depForm = this.fb.group({
      companyID: [''],
      updateBookTillDate: [ '', Validators.required ],

      // invStartDate: [this.today, [Validators.required, noWhitespaceValidator()]],
      // invEndDate: [this.today, [Validators.required, noWhitespaceValidator()]],
    });
  }
  getAllCompanies()
  {
    this.fetchingData = true
    this.tableDataService.getTableData('Company/GetAllCompanies', { get: 1 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: CompanyDtoResponse) =>
        {
          if (res)
          {
            this.allCompanies = res.data;
          } else
          {

          }
        },
        error: (err) => { }
      })
  }
  CloseBooksNow()
  {
    console.log('dd');
    if (this.depForm.valid)
    {

      let depEngTree: any = [];
      this.gridApi.getSelectedRows().map((x: any) => {
        depEngTree.push({
          bookIDs: x.bookID,
        });
      });

      this.sendingRequest = true
      const apiCall$ = this.tableDataService.getTableData('DepreciationMethod/RunDepreciationEngineonAssets', { add: 1, updateBookTillDate: this.depForm.get('updateBookTillDate')?.value, depEngTree })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success')
            } else
            {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) =>
          {
            this.toast.show(err.title, 'error')
          }
        })
    } else
    {
      validateAllFormFields(this.depForm)
    }
  }

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    // this.gridApi.showLoadingOverlay()
  }

  onFilterTextBoxChanged(event: Event)
  {
    this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    this.getDepreciationEngine(this.companyId, this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getDepreciationEngine(this.companyId, this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
