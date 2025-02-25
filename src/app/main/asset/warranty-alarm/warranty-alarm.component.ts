import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { first, finalize, take, Subject } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { ColDef, GridApi, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { ActionCellService } from '../../shared/service/action-cell.service';
import { GridDataService } from '../../shared/service/grid-data.service';
import { AddressTemplateDtoResponse } from '../../shared/dtos/AddressTemplate/AddressTemplateDto';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'warranty-alarm',
  templateUrl: './warranty-alarm.component.html',
  styleUrls: ['./warranty-alarm.component.scss']
})
export class WarrantyAlarmComponent implements OnInit {

  gridData: any[] = [];
  gridView: any[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  search = new FormControl('')
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  searchString = '';
  @ViewChild('grid', { static: false }) grid!: GridComponent;

  warrantyAlarmGridCols: ColDef[] = [
      { field: 'iconIndex', headerName: '', width: 60,
        cellRenderer: (params: any) => {
          const iconElement = document.createElement('span');
          if (params.value == 1) {
            iconElement.innerHTML = '<i class="material-icons mt-2" style="color: red;">cancel</i>';
          } else {
            iconElement.innerHTML = '<i class="material-icons mt-2" style="color: orange;">warning</i>';
          }
          return iconElement;
        }
       },
      { field: 'assetID', flex: 1, headerName: 'Asset ID' },
      { field: 'assetNumber', flex: 1, headerName: 'Asset Number' },
      { field: 'description', flex: 1, headerName: 'Description' },
      { field: 'refNo', flex: 1, headerName: 'Ref No' },
      { field: 'warrantyStart', flex: 1, headerName: 'Warranty Start',cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'expiryDate', flex: 1, headerName: 'Expiry Date', cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'dismiss', flex: 1, headerName: 'Dismiss',
        cellRenderer: (params: any) => {
        const link = document.createElement('span');
        link.style.textDecoration = 'underline';
        link.style.color = 'blue'; // Optional: style it as a link
        link.style.cursor = 'pointer';
        link.innerText = params.value;
        link.onclick = () => {
          console.log('Clicked:', params.data);
          this.removeHandler(params.data.id, params.data.assetNumber); // Execute your function here
        };
        return link;
      } }
    ];


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

  private gridDataService = inject(GridDataService)
  astID: any;


  constructor(private datePipe: DatePipe, private ngZone:NgZone,private tableDataService: TableDataService, private router: Router, private toast: toastService, private confirmationDialogService: ConfirmationDialogService) {
  }


  ngOnInit(): void {
    this.gridView = [
      {
        barcode: '0704150003',
        rfid: '00000000000704150003',
        status: 'Temp For Existing Assets',
      },
      {
        barcode: '0704150004',
        rfid: '00000000000704150004',
        status: 'Temp For Existing Assets',
      },
      {
        barcode: '0704150005',
        rfid: '00000000000704150005',
        status: 'Temp For Existing Assets',
      },
      {
        barcode: '0704150006',
        rfid: '00000000000704150006',
        status: 'Temp For Existing Assets',
      }
    ]
     this.getWarrantyAlaram()
  }
  ngAfterViewInit(): void {
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this.grid.autoFitColumns();
      });
  }

  getWarrantyAlaram() {
    this.fetchingData = true
    this.tableDataService.getTableDataGet('Warranty/GetAllWarrantyAssets')
    .pipe(first(), finalize(() => this.fetchingData = false))
    .subscribe({
      next: (res) => {
        if (res) {
          this.gridData = res.reverse();
            this.gridView = this.gridData.reverse()
          console.log(res,'location')
        } else {
          this.toast.show(res.message, 'error')
        }
      },
      error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
    })
  }



  removeHandler(id: any, astID: any) {
    this.confirmationDialogService.customDialog('Are you sure to dismiss?')
      .then((confirmed) => {
        if (confirmed) {
          this.sendingRequest = true;
          const payload = {warrantyID:id , astID:astID}
          this.tableDataService.getTableData('Warranty/DeleteWarranty', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) => {
                if (res && res.status === '200') {
                  this.toast.show(res.message, 'success')
                  this.getWarrantyAlaram();
                } else {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      });
  }

  public pageChange(event: number): void
  {
    this.pagination.currentPage = event;
    // this.getWarrantyAlaram(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number)
  {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.getWarrantyAlaram(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator()
  {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

  openAsset(){
    if(this.astID){
    // this.router.navigate(['main/asset/details-maintenance'],
    //   {
    //     queryParams: {
    //       astID: this.astID
    //     },
    //   })
      window.open('#/main/asset/details-maintenance?astID='+ this.astID);
    }else{
      this.toast.show('Select the Data', 'warning')
    }
  }
  onRowClicked(event: any) {


    this.astID = event.assetID;

    console.log('row', event);
  }

  dismissAll(){
    this.confirmationDialogService.customDialog('Are you sure to dismiss all?')
      .then((confirmed) => {
        if (confirmed) {
          this.sendingRequest = true;
          this.gridData.forEach(x => {
            const payload = {warrantyID:x.id , astID:x.assetID}
          this.tableDataService.getTableData('Warranty/DeleteWarranty', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) => {
                if (res && res.status === '200') {
                  this.toast.show(res.message, 'success')
                } else {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
          });

        }
      });
  }

}
