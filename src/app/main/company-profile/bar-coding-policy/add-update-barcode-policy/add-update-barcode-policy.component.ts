import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { finalize, first, map } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { ConfirmationDialogService } from 'src/app/main/shared/service/confirmation-dialog.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { Location } from '@angular/common'
import { BarCodeStructureDtoResponse } from 'src/app/main/shared/dtos/BarCodeStructure/BarCodeStructureDto';
import { BarCodePolicyDto, BarCodePolicyDtoResponse } from 'src/app/main/shared/dtos/BarCodingPolicy/BarCodePolicyDto';
import { CompanyDto, CompanyDtoResponse } from 'src/app/main/shared/dtos/Companies/companyDtos';
@Component({
  selector: 'app-add-update-barcode-policy',
  templateUrl: './add-update-barcode-policy.component.html',
  styleUrls: ['./add-update-barcode-policy.component.scss']
})
export class AddUpdateBarcodePolicyComponent implements OnInit {
  BarcodeStructure: any[]= [];
  BarcodeStructureView: any[] = [];
  today = new Date();
  barCodePolicyForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  scheduleId!: number;
  fetchingData: boolean = false;
  CompanyData: any;
  public data: CompanyDto[] = [];

  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(private location: Location,private confirmationDialogService: ConfirmationDialogService,private intl: IntlService, private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router,
    private tableDataService: TableDataService,) { }

  ngOnInit(): void {
    this.getAllCompanies();
    this.GetAllBarcodeStructures();
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.scheduleId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.scheduleId;
    this.initializescheduleForm();

    if (this.isEditMode) {
      this.getScheduleById()
    }
  }
  getScheduleById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }

    this.dataService.getTableDataGet('BarcodeStructure/GetAllBarcodingPolicy')
      .pipe(
        map((schedulesList: BarCodePolicyDtoResponse) =>
          schedulesList.data.find((schedule: BarCodePolicyDto) => schedule.companyId == this.scheduleId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.barCodePolicyForm.patchValue({
            companyID: res?.companyId,
            barcodeStructureID: res?.barStructID
          })
        }
      })
  }
  GetAllBarcodeStructures() {
    this.fetchingData = true;
    this.tableDataService.getTableData('BarcodeStructure/GetAllBarcodeStructures',{ get: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: BarCodeStructureDtoResponse) => {
          if (res) {
            //this.BarcodeStructure = res.reverse();
            this.BarcodeStructureView = res.data.reverse();
            console.log(this.BarcodeStructureView);
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  initializescheduleForm() {
    this.barCodePolicyForm = this.fb.group({
      companyID: ['', [Validators.required]],
      barcodeStructureID: ['', [Validators.required]],
      loginName: [JSON.parse(localStorage.getItem('userObj')!).loginName],
    })
  }

  onSubmit() {
    if (this.barCodePolicyForm.valid) {
      //this.sendingRequest = true
      const CompanySelected= this.allCompanies.find((company: any) => company.companyId==this.barCodePolicyForm.value.companyID);
      const barcodeid = this.BarcodeStructureView.find((barcode: any) => barcode.barCode==this.barCodePolicyForm.value.structure);
      const obj= {
        companyId:CompanySelected?.companyId,
        companyCode:CompanySelected?.companyCode,
        companyName:CompanySelected?.companyName,
        barCodeStrucId:barcodeid?barcodeid.barStructID:this.barCodePolicyForm.value.structure,
      }
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('Company/UpdateCompany', { update: 1, ...obj }) : this.dataService.getTableData('Company/UpdateCompany', { update: 1, ...obj })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              if(!this.isEditMode){
                // this.ApplyPolicy(this.barCodePolicyForm.value.companyID)
              }else{
                this.location.back()
              }
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.barCodePolicyForm)
    }
  }

  ApplyPolicy(){
    if (this.barCodePolicyForm.valid) {

    this.confirmationDialogService.ApplyPolicy().then((confirmed) => {
      if (confirmed) {
        this.fetchingData = true
        this.dataService.getTableData('BarcodeStructure/ApplyBarcodePolicy', this.barCodePolicyForm.value)
        .pipe(
          first(),
          finalize(() => (this.fetchingData = false))
        )
        .subscribe({
          next: (res) =>
          {
            if (res && res.status === '200')
            {
              this.toast.show(res.message, 'success');
              this.location.back();
            } else
            {
              this.toast.show(res.message, 'error');
            }
          },
          error: (err) =>{
            this.toast.show('Something went wrong!', 'error');
            this.location.back();
          }
        });
      }
    })
  } else {
    validateAllFormFields(this.barCodePolicyForm)
  }
  }
  allCompanies: CompanyDto[] = []


  getAllCompanies() {
    this.fetchingData = true
    this.tableDataService.getTableData('Company/GetAllCompanies', { get: 1 })
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res:CompanyDtoResponse) => {
          if (res) {
            this.allCompanies = res.data.reverse()
            this.data = this.allCompanies;
            console.log(this.allCompanies,'llir')

          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }


  handleFilter(value:any) {
    this.data = this.allCompanies.filter(
      (s:any) =>s.companyName
      .toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}
