import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import { debounceTime, distinctUntilChanged, finalize, first, Subject, takeUntil } from 'rxjs';
import { toastService } from '../../shared/toaster/toast.service';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { InventoryScheduleDtoResponse } from '../../shared/dtos/InventorySchedule/InventoryScheduleDto';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';

@Component({
  selector: 'app-inventory-schedules',
  templateUrl: './inventory-schedules.component.html',
  styleUrls: ['./inventory-schedules.component.scss']
})
export class InventorySchedulesComponent implements OnInit {
  gridData: any[] = [];
  gridView: any[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  searchText: string = '';
  searchSubject = new Subject<string>();
  inventorySchedulesGridCols: ColDef[] = [];

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
  faFileExcel = faFileExcel
  faFilePdf = faFilePdf
  private gridApi!: GridApi;

  private actionCellService = inject(ActionCellService)
  private gridDataService = inject(GridDataService)

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router, private route: ActivatedRoute,
    public GeneralService: GeneralService
  )
  {
    this.inventorySchedulesGridCols = this.gridDataService.getColumnDefs(GridType.InventorySchedules,
      this.GeneralService.permissions['Inventory Schedules']);
  }

  ngOnInit(): void
  {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(queryParams[ 'currentPage' ] ?? this.pagination.currentPage);
    const pageSize = Number(queryParams[ 'pageSize' ] ?? this.pagination.pageSize);

    this.getAllSchedules(currentPage, pageSize)
    this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.InventorySchedules)
      {
        this.onEditClick(data.rowData.invSchCode)
      }
    })
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) =>
    {
      if (data.gridName === GridType.InventorySchedules)
      {
        this.removeHandler(data.rowData.invSchCode)
      }
    })
    
    this.searchHandler();
  }

  private searchHandler()
  {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe((term) =>
    {
      this.searchText = term;
      this.getAllSchedules(this.pagination.currentPage, this.pagination.pageSize);
    });
  }

  ngOnDestroy()
  {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  getAllSchedules(currentPage: number, pageSize: number)
  {
    this.fetchingData = true;

    let payload: any = {
      get: 1,
      paginationParam: {
        pageIndex: currentPage,
        pageSize: pageSize,
      }
    }

    if (this.searchText !== "") {
      payload = {
        ...payload,
        searching: 1,
        var: this.searchText,
      }
    }

    this.tableDataService.getTableDataWithPagination('InvSch/GetAllInvSchs', payload)
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: InventoryScheduleDtoResponse) => {
          if (res) {
            debugger
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse()
            this.pagination.currentPage = currentPage
            this.pagination.pageSize = pageSize
            this.pagination.totalItems = res.totalRowsCount
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  onEditClick(Id: number)
  {
    this.router.navigate(
      [ 'edit', Id ],
      {
        relativeTo: this.route,
        queryParams: {
          currentPage: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
        },
      }
    );
  }

  removeHandler(invSchCode: any) {
    this.confirmationDialogService.confirm()
      .then((confirmed) => {
        if (confirmed) {
          this.sendingRequest = true;
          const payload = { invSchCode }
          this.tableDataService.getTableData('InvSch/DeleteInvSch', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) => {
                if (res && res.status === '200') {
                  this.toast.show(res.message, 'success')
                  this.getAllSchedules(this.pagination.currentPage, this.pagination.pageSize)
                } else {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      });
  }

  onGridReady(params: GridReadyEvent)
  {
    this.gridApi = params.api;
    this.gridApi.showLoadingOverlay()
  }

  onFilterTextBoxChanged()
  {
    this.searchSubject.next(this.searchText)
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    this.getAllSchedules(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getAllSchedules(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
  validateInv(): void
  { var invCodeForValidate
    const rows: any = this.gridApi.getSelectedRows();
    if (rows.length === 0) {
      this.toast.show("Please select Inventory Schedule First", 'warning')

   //   return;
    }
    else{
     invCodeForValidate = (rows[0]["invSchCode"])
   
     const payloaddddd = {
      
      invSchCode: invCodeForValidate,
     
     }; 
       this.apiUrl = "InvSch/ValidateInvSch";
   
       this.tableDataService
       .getTableDataWithPagination(this.apiUrl,payloaddddd)
       .pipe(
         first(),
         finalize(() => (this.fetchingData = false))
       )
       .subscribe({
         next: (res: any) => {
           if (res) {
            console.log(res)
            if(res.status!=200)
            {
              this.toast.show(res.message, 'error')

            }
            else{
              this.toast.show(res.message, 'success')

            }
          //  const csvContent = this.convertToCSV(res.data.data);
   
     // Step 5: Download the CSV File
     //this.downloadCSV(csvContent, 'assets_administration.csv');
   
     
           //  this.handleApiResponse(res);  // Process the response and update the grid data
           }
         },
         error: (err) =>
           this.toast.show(err ?? 'Something went wrong!', 'error'),
       });
   

    }
  }
  exportToCSV(): void
  {
    this.gridDataService.exportToCSV(this.gridApi, GridType.InventorySchedules);
  }
  apiUrl: any;
   
  exportToCSV2(): void
  {
    const payloaddddd = {
    
  }; 
    this.apiUrl = "InvSch/GetInProcessInvSchs";

    this.tableDataService
    .getTableDataWithPagination2(this.apiUrl,payloaddddd)
    .pipe(
      first(),
      finalize(() => (this.fetchingData = false))
    )
    .subscribe({
      next: (res: any) => {
        if (res) {
          debugger
         debugger
          if(res.length>0)
          {
            console.log(res.data.data)

            const csvContent = this.convertToCSV(res.data.data);

            // Step 5: Download the CSV File
            this.downloadCSV(csvContent, 'assets_administration.csv');
          }
          else{
            this.toast.show('No inventory is in progress', 'warning')

          }

  
        //  this.handleApiResponse(res);  // Process the response and update the grid data
        }
      },
      error: (err) =>
        this.toast.show(err ?? 'Something went wrong!', 'error'),
    });

  }
 
  
  
  // Helper function: Trigger CSV download
  downloadCSV(csvContent: string, filename: string) {
    const utf8BOM = '\uFEFF'; // UTF-8 Byte Order Mark
    const blob = new Blob([utf8BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  convertToCSV(data: any[]): string {
    if (!data.length) return '';
  
    const headers = Object.keys(data[0]);
  
    // Escapes each field according to CSV rules
    const escapeCSVField = (field: any): string => {
      if (field === null || field === undefined) return '';
      let str = String(field);
      if (str.includes('"')) {
        str = str.replace(/"/g, '""'); // Escape double quotes
      }
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        str = `"${str}"`; // Wrap in double quotes
      }
      return str;
    };
  
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => escapeCSVField(row[header])).join(','))
    ];
  
    return csvRows.join('\n');
  }
  }

 
