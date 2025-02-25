import { GeneralService } from 'src/app/main/shared/service/general.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomvalidationService } from 'src/app/main/shared/service/customvalidation.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { DetailMaintenanceService } from '../detail-maintenance.service';
import { finalize, first } from 'rxjs';
import { validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { SuppliersDto, SuppliersDtoResponse } from 'src/app/main/shared/dtos/Suppliers/SuppliersDto';
import { InsurersDto, InsurersDtoResponse } from 'src/app/main/shared/dtos/Insurers/InsurersDto';

@Component({
  selector: 'app-extended-information',
  templateUrl: './extended-information.component.html',
  styleUrls: ['./extended-information.component.scss']
})
export class ExtendedInformationComponent implements OnInit {
  @Input() detailsMaintenanceData: any;
  extendedInformationForm!: FormGroup;
  sendingRequest: boolean = false;
  today = new Date();
  fetchingData: boolean;
  public supplierList: SuppliersDto[] = [];
  searchString: string = '';
  insurerList: InsurersDto[] = [];
  astModel: any;
  serialNo: any;
  labelCount: any;
  transRemarks: any;
  suppID: any;
  insID: any;
  poCode: any;
  poNumber: any;
  invNumber: any;
  capitalizationDate: any;
  bussinessArea: any;
  refCode: any;
  createdBy: any;
  capex: any;
  grn: any;
  customFld1: any;
  customFld2: any;
  customFld3: any;
  customFld4: any;
  customFld5: any;
  customFld6: any;
  customFld7: any;
  customFld8: any;
  customFld9: any;
  plate: any;
  oldAstID: any;
  astID: any;
  bookID: any;
  extentedInformationForm: any;
  isEditMode: any;


  public dataSupplier: SuppliersDto[] = [];
  public dataInsurer: InsurersDto[] = [];
  allPO: any;
  poerp: any;



  constructor(
    private fb: FormBuilder,
    public detailMaintenanceService : DetailMaintenanceService,
    public tableDataService : TableDataService,
    public GeneralService: GeneralService,
    private toast: toastService,

  ) {}

  ngOnInit(): void {
    if (this.detailsMaintenanceData != undefined) {
      let extendedData =this.detailsMaintenanceData.assetInformationExtendentedInformation[0];
      this.isEditMode = true;
      this.astID = extendedData.astID;
      this.astModel = extendedData.astModel;
      this.serialNo = extendedData.serailNo;
      this.labelCount = extendedData.labelCount;
      this.transRemarks = extendedData.transRemarks;
      this.suppID = extendedData.suppID;
      this.poerp = extendedData.poerp;
      this.insID = extendedData.insID;
      this.poCode = extendedData.poCode;
      this.poNumber = extendedData.poNumber;
      this.invNumber = extendedData.invNumber;
      this.capitalizationDate = extendedData.capitalizationDate?new Date(extendedData.capitalizationDate):new Date();
      this.bussinessArea = extendedData.bussinessArea;
      this.refCode = extendedData.refCode;
      this.plate = extendedData.plate;
      this.createdBy = extendedData.createdBY;
      this.capex = extendedData.capex;
      this.grn = extendedData.grn;
      this.customFld1 = extendedData.customFld1;
      this.customFld2 = extendedData.customFld2;
      this.customFld3 = extendedData.customFld3;
      this.customFld4 = extendedData.customFld4;
      this.customFld5 = extendedData.customFld5;
      this.customFld6 = extendedData?.customFld6;
      this.customFld7 = extendedData?.customFld7;
      this.customFld8 = extendedData?.customFld8;
      this.customFld9 = extendedData?.customFld9;
    }
    console.log(this.detailsMaintenanceData);

    this.initializebrandForm();
    this.getAllSuppliers();
    this.getAllInsurers();
    this.getAllPO();
  }

  initializebrandForm(data?: any) {
    this.extendedInformationForm = this.fb.group({
      astModel: [''],
      serialNo: [''],
      labelCount: [{value:'',disabled: true}],
      oldAstID: [{value:'',disabled: true}],
      transRemarks: [''],
      suppID: [''],
      insID: [''],
      poerp: [''],
      poCode: [''],
      poNumber: [''],
      invNumber: [''],
      capitalizationDate: [''],
      bussinessArea: [''],
      plate: [''],
      createdBy: [''],
      refCode: [''],
      capex: [''],
      grn: [''],
      customFld1: [''],
      customFld2: [''],
      customFld3: [''],
      customFld4: [''],
      customFld5: [''],
      customFld6: [''],
      customFld7: [''],
      customFld8: [''],
      customFld9: [''],
    });
  }
  getAllInsurers() {
    this.fetchingData = true
    this.tableDataService.getTableData('Insurer/GetAllInsurers', { get: 1, searching: 1, var: this.searchString })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: InsurersDtoResponse) => {
          if (res) {
            this.insurerList = res.data.reverse();
            this.dataInsurer=this.insurerList.slice();
            console.log(this.insurerList,'Insurer')
          } else {

          }
        },
        error: (err) => {}
      })
  }
  getAllPO() {
    this.fetchingData = true
    this.tableDataService.getTableData('PO/GetApprovedPOsForTransit', {
      "get": 1,
      "dropdown": 1,

    })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          if (res) {
            this.allPO = res.data.reverse();
            console.log( this.allPO,'allPO')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
  getAllSuppliers() {
    this.tableDataService.getTableData('Supplier/GetAllSuppliers', { get: 1, "dropdown": 1})
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res: SuppliersDtoResponse) => {
          if (res) {
            this.supplierList = res.data.reverse();
            this.dataSupplier=this.supplierList.slice();
            console.log(this.supplierList,'Supplier')
          } else {
          }
        },
        error: (err) =>{}
      })
  }
  image: any = '';
  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const base64Image: string = e.target.result;
      this.image = base64Image;
      this.extendedInformationForm.patchValue({
        imageBase64: this.image,
      });
      console.log(base64Image); // You can perform further operations with the base64 image
    };

    reader.readAsDataURL(file);
  }

  submit(){
    if (this.extendedInformationForm.valid) {
      this.sendingRequest = true
      // this.setAllValues(this.astID, true);
      const apiCall$ = this.tableDataService.getTableData('Assets/UpdateAssetDetails', { update: 1, astID:this.astID, ...this.extendedInformationForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              // this.setAllValues(this.astID, true);
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
      validateAllFormFields(this.extendedInformationForm)
    }
  }
  clear(){

  }

  handleSupplier(value:any) {
    this.dataSupplier = this.supplierList .filter(
      (s:any) =>s.suppName
      .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  handlePO(value:any) {
    this.allPO = this.allPO.filter(
      (s:any) =>s.poCode
      .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleInsurer(value:any) {
    this.dataInsurer = this.insurerList.filter(
      (s:any) =>s.insName
      .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }



}
