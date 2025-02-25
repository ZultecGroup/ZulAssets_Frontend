import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { first, finalize, take } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';

@Component({
  selector: 'app-data-transfer',
  templateUrl: './data-transfer.component.html',
  styleUrls: ['./data-transfer.component.scss']
})
export class DataTransferComponent implements OnInit {

  gridData: any[] = [];
  gridView: any[] = []
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  search = new FormControl('')
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  searchString = '';
  @ViewChild('grid', {static:false}) grid!: GridComponent;
  constructor(private ngZone:NgZone,private tableDataService: TableDataService, private toast: toastService, private confirmationDialogService: ConfirmationDialogService) {
    // this.search.valueChanges
    //   .pipe(
    //     debounceTime(1000),
    //     distinctUntilChanged()
    //   ).subscribe(res => {
    //     this.searchString = res
    //     this.getAllAddresses()
    //   })
  }

  ngOnInit(): void {
    this.gridView = [
      {
        deviceID: 1,
        deviceDesc: 'Device 1',
        commType: 'MS Active Sync',
        deviceIp: '...',
        progress:''
      }
    ]
    // this.getAllAddresses()
  }

  ngAfterViewInit(): void {
    this.ngZone.onStable
      .asObservable()
      .pipe(take(1))
      .subscribe(() => {
        this.grid.autoFitColumns();
      });
  }

  getAllAddresses() {
    this.fetchingData = true
    this.tableDataService.getTableData('AddressTemplate/GetAllAddressTemplates', { get: 1, searching: 1, var: this.searchString })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          if (res) {
            this.gridData = res.reverse();
            this.gridView = this.gridData.reverse()
          } else {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

  removeHandler(addressID: number) {
    this.confirmationDialogService.confirm()
      .then((confirmed) => {
        if (confirmed) {
          this.sendingRequest = true;
          const payload = { addressID }
          this.tableDataService.getTableData('AddressTemplate/DeleteAddressTemplate', { delete: 1, ...payload })
            .pipe(first(), finalize(() => this.fetchingData = false))
            .subscribe({
              next: (res) => {
                if (res && res.status === '200') {
                  this.toast.show(res.message, 'success')
                  this.getAllAddresses()
                } else {
                  this.toast.show(res.message, 'error')
                }
              },
              error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
            })
        }
      });
  }

  onFilter(inputValue: string): void {
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "addressDesc",
            operator: "contains",
            value: inputValue,
          }
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

}
