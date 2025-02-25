import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { finalize, first, Subject } from 'rxjs';
import { AdditionalCostHistoryDto } from 'src/app/main/shared/dtos/AdditionalCostHistroy/AdditionalCostDto';
import { GridType } from 'src/app/main/shared/dtos/GridType/GridType';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { GeneralService } from 'src/app/main/shared/service/general.service';
import { GridDataService } from 'src/app/main/shared/service/grid-data.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-additional-cost-history',
  templateUrl: './additional-cost-history.component.html',
  styleUrls: ['./additional-cost-history.component.scss']
})
export class AdditionalCostHistoryComponent implements OnInit {
  @Input() detailsMaintenanceData: any;

  gridView: any = [];
  AddCostType: any;
  achForm!: FormGroup;
  AllCostType: any;
  typeDesc: any;
  addCost: any = 0;
  sendingRequest: boolean;
  public dataCostType: Array<{ name: string; id: number }>;
  extendWarranty: FormGroup;
  warrantyStart: any;
  warrantyEnd: any;
  warrantyPeriodMonth: any;
  alarmActivate: any;

  additionalCostHistoryGridCols: ColDef[] = [];

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

  constructor(
    private toast: toastService,
    public tableDataService: TableDataService,
    private formBuilder: FormBuilder,
    public generalService: GeneralService
  ) {

      this.additionalCostHistoryGridCols = this.gridDataService.getColumnDefs(GridType.AdditionalCostHistory,this.generalService.permissions['Detail & Maintenance']);
  }

  ngOnInit(): void {
    if (this.detailsMaintenanceData != undefined) {
      let additonalCost =this.detailsMaintenanceData.additionalCostInformation[0];
      this.astID = this.detailsMaintenanceData.assetInformationExtendentedInformation[0].astID
      if (additonalCost != undefined) {
        this.gridView = this.detailsMaintenanceData.additionalCostInformation;
        // this.typeDesc = additonalCost.typeDescription
        // this.addCost = additonalCost.additionalCost

      }
    }
    this.GetAllAddCostType();
    this.initializeAddForm();
  }
  submit() {
    if (this.achForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.tableDataService.getTableData('AdditionalCostType/InsertAddCostType',
        { add: 1, astID:this.astID, ...this.achForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.setAllValues(this.astID);
              // this.router.navigate(['main/master-data/custodians'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.achForm)
    }
  }


  setBValues(event: any) {
    console.log(event);

  }
  initializeAddForm(data?: any) {
    this.achForm = this.formBuilder.group({
      typeDesc: ['', [Validators.required]],
      addCost: ['', [Validators.required, noWhitespaceValidator()]],
    });
  }

  GetAllAddCostType() {
    this.tableDataService.getTableData('AdditionalCostType/GetAllAddCostType', { get: 1, searching: 1 })
      .pipe(first(), finalize(() => { }))
      .subscribe({
        next: (res: AdditionalCostHistoryDto[]) => {
          if (res) {
            this.AllCostType = res.reverse();
            this.dataCostType = this.AllCostType.slice();
            console.log(this.AllCostType, 'typeCost')
          } else {
          }
        },

      })
  }


  handleCostType(value: any) {
    this.dataCostType = this.dataCostType.filter(
      (s: any) => s.typeDesc
        .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    // this.GetAllAddCostType(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number) {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.GetAllAddCostType(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator() {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }

  clear(){
    this.typeDesc = '';
    this.addCost = 0;
  }

  onRowClicked(event: any) {
    this.typeDesc = event.typeDescription
    this.addCost = event.additionalCost
    console.log('row', event);
  }
  public setAllValues(e:any){
    this.sendingRequest = true;
    this.tableDataService.getTableData('Assets/GetAstInfoByAstID', { get: 1, searching: 1,astID: e })
      .pipe(first(), finalize(() => this.sendingRequest = false))
      .subscribe({
        next: (result) => {
          if (result.hasOwnProperty("additionalCostInformation")) {

            this.gridView = result.additionalCostInformation;
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
}

