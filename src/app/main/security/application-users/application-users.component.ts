import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  Subject,
  takeUntil,
} from 'rxjs';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { UsersDto, UsersDtoResponse } from '../../shared/dtos/Users/UsersDto';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';

@Component({
  selector: 'app-application-users',
  templateUrl: './application-users.component.html',
  styleUrls: ['./application-users.component.scss'],
})
export class ApplicationUsersComponent implements OnInit {
  gridData: UsersDto[] = [];
  gridView: UsersDto[] = [];
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  searchText: string = '';
  searchSubject = new Subject<string>();
  accessList: Array<Item> = [
    { text: 'Desktop Application', value: 1 },
    { text: 'Mobile Application', value: 2 },
    { text: 'Both', value: 3 },
  ];

  usersGridCols: ColDef[] = [];

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }

  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [15, 30, 50, 100, 200, 500],
  }
  isDestroyed$: Subject<boolean> = new Subject();
  private gridApi!: GridApi;
  private actionCellService = inject(ActionCellService)
  private gridDataService = inject(GridDataService)


  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router, private route: ActivatedRoute,
    public GeneralService: GeneralService
  ) {
    this.usersGridCols = this.gridDataService.getColumnDefs(GridType.Users, this.GeneralService.permissions['Application Users'])
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(queryParams['currentPage'] ?? this.pagination.currentPage);
    const pageSize = Number(queryParams['pageSize'] ?? this.pagination.pageSize);

    this.getUserList(currentPage, pageSize);
    this.actionCellService.primaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) => {
      if (data.gridName === GridType.Users) {
        this.onEditClick(data.rowData.loginName)
      }
    })
    this.actionCellService.secondaryClicked$.pipe(takeUntil(this.isDestroyed$)).subscribe((data) => {
      if (data.gridName === GridType.Users) {
        this.removeHandler(data.rowData.loginName)
      }
    })

    this.searchHandler();
  }

  private searchHandler() {
    this.searchSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe((term) => {
      this.searchText = term;
      this.getUserList(1, this.pagination.pageSize);
    });
  }

  ngOnDestroy() {
    this.isDestroyed$.next(true)
    this.isDestroyed$.complete()
  }

  getUserList(currentPage: number, pageSize: number) {
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

    this.tableDataService
      .getTableDataWithPagination('User/GetAllUsers', payload)
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: UsersDtoResponse) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.currentPage = currentPage;
            this.pagination.pageSize = pageSize;
            this.pagination.totalItems = res.totalRowsCount;
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  onEditClick(Id: number) {
    this.router.navigate(
      ['edit', Id],
      {
        relativeTo: this.route,
        queryParams: {
          currentPage: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
        },
      }
    );
  }

  removeHandler(loginName: string) {
    this.confirmationDialogService.confirm().then((confirmed) => {
      if (confirmed) {
        this.sendingRequest = true;
        this.tableDataService
          .InsertNewUser('User/DeleteUser', { delete: 1, loginName })
          .pipe(
            first(),
            finalize(() => (this.fetchingData = false))
          )
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success');
                this.getUserList(this.pagination.currentPage, this.pagination.pageSize);
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
    this.gridApi.showLoadingOverlay()
  }

  onFilterTextBoxChanged() {
    this.searchSubject.next(this.searchText)
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }


  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    this.getUserList(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number) {
    this.resetPaginator()
    this.pagination.pageSize = event;
    this.getUserList(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator() {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
}
interface Item {
  text: string;
  value: number;
}
