import { GeneralService } from './../../../shared/service/general.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomvalidationService } from 'src/app/main/shared/service/customvalidation.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { DetailMaintenanceService } from '../detail-maintenance.service';
import { ColDef } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { GridType } from 'src/app/main/shared/dtos/GridType/GridType';
import { GridDataService } from 'src/app/main/shared/service/grid-data.service';
import { noWhitespaceValidator } from 'src/app/main/shared/helper/functions.component';

@Component({
  selector: 'app-depreciation-information',
  templateUrl: './depreciation-information.component.html',
  styleUrls: ['./depreciation-information.component.scss']
})
export class DepreciationInformationComponent implements OnInit {
  @Input() detailsMaintenanceData: any;

  assetsInformationForm!: FormGroup;
  sendingRequest: boolean = false;
  today = new Date();
  gridData: any[] = [];
  gridView: any[] = []
  assetBookList: any[] = []
  monthlyExpectedDepreciation: any[] = []
  annualExpectedDepreciation: any[] = []
  fetchingData: boolean = false;
  astID: any;
  description: any;
  depDesc: any;
  AccDeprec: any;
  salvageYear: any;
  salvageValuePercent: any;
  bookID: any;
  bookUpdateDate: any;
  totalCost: any;
  currentBV: any;
  salvageMonth: any;
  salvageValue: any;

  assetsBookListGridCols: ColDef[] = [];
  expectedDepricationGridCols: ColDef[] = [];
  fiscalYearDepreciationGridCols: ColDef[] = [];

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: TableDataService,
    private toast: toastService,
    private router: Router,
    private customValidator: CustomvalidationService,
    public detailMaintenanceService : DetailMaintenanceService,
    private generalService: GeneralService
  ) {
    this.assetsBookListGridCols = this.gridDataService.getColumnDefs(GridType.AssetBookList, this.generalService.permissions['Detail & Maintenance']);
    this.expectedDepricationGridCols = this.gridDataService.getColumnDefs(GridType.AnualExpectedDeprication, this.generalService.permissions['Detail & Maintenance']);
    this.fiscalYearDepreciationGridCols = this.gridDataService.getColumnDefs(GridType.MonthlyExpectedDeprication, this.generalService.permissions['Detail & Maintenance']);
  }

  ngOnInit(): void {
    if (this.detailsMaintenanceData != undefined) {
      let depreciation =this.detailsMaintenanceData.assetBookInformation[0];
      if (depreciation != undefined) {
        this.assetBookList =this.detailsMaintenanceData.assetBookInformation;
        this.monthlyExpectedDepreciation =this.detailsMaintenanceData.monthlyExpectedDepreciation;
        this.annualExpectedDepreciation =this.detailsMaintenanceData.annualExpectedDepreciation;
        this.astID = depreciation.astID;
        this.description = depreciation.description;
        this.depDesc = depreciation.depDesc;
        this.AccDeprec = 0;
        this.salvageYear = depreciation.salvageYear;
        this.salvageValuePercent = depreciation.salvageValuePercent;
        this.bookID = depreciation.bookID;
        this.bookUpdateDate = new Date(depreciation.bookUpdateDate);
        this.totalCost = this.detailsMaintenanceData.assetInformationExtendentedInformation[0].acquisitionPrice;
        this.currentBV = depreciation.currentBV;
        this.salvageMonth = depreciation.salvageMonth;
        this.salvageValue = depreciation.salvageValue;
      }
    }

    this.initializebrandForm();
  }

  initializebrandForm(data?: any) {
    this.assetsInformationForm = this.fb.group({
      ItemCode: ['', [Validators.required, noWhitespaceValidator()]],
      invStartDate: [this.today, [Validators.required, noWhitespaceValidator()]],
      invEndDate: [this.today, [Validators.required, noWhitespaceValidator()]],
    });
  }
  image: any = '';
  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const base64Image: string = e.target.result;
      this.image = base64Image;
      this.assetsInformationForm.patchValue({
        imageBase64: this.image,
      });
      console.log(base64Image); // You can perform further operations with the base64 image
    };

    reader.readAsDataURL(file);
  }


  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    // this.getTrackingHistory(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChange(event: number) {
    this.resetPaginator()
    this.pagination.pageSize = event;
    // this.getTrackingHistory(this.pagination.currentPage, this.pagination.pageSize)
  }

  private resetPaginator() {
    this.pagination.currentPage = 1
    this.pagination.totalItems = 0
  }
  onRowClicked(event: any) {
    this.astID = event.astID;
        this.description = event.description;
        this.depDesc = event.depDesc;
        this.AccDeprec = event.salvageMonth;
        this.salvageYear = event.salvageYear;
        this.salvageValuePercent = event.salvageValuePercent;
        this.bookID = event.bookID;
        this.bookUpdateDate = new Date(event.bookUpdateDate);
        this.currentBV = event.currentBV;
        this.salvageMonth = event.salvageMonth;
        this.salvageValue = event.salvageValue;
    console.log('row', event);
  }

}
