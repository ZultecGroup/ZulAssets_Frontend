import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator, validateAllFormFields } from '../../shared/helper/functions.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailMaintenanceService {

  detailForm: FormGroup

  detailFormInitilizer(data?:any){
  this.detailForm = this.fb.group({
    astID: new FormControl(data? data.astID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    dispCode: new FormControl({ value: data? data.dispCode : null, disabled: true }, Validators.compose([Validators.required, noWhitespaceValidator()])),
    itemCode: new FormControl(data? data.itemCode : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    suppID: new FormControl(data? data.suppID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    poCode: new FormControl(data? data.poCode : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    invNumber: new FormControl(data? data.invNumber : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    custodianID: new FormControl(data? data.custodianID : '12', Validators.compose([Validators.required, noWhitespaceValidator()])),
    baseCost: new FormControl(data? data.baseCost : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    totalAdditionalCost: new FormControl(data? data.totalAdditionalCost : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    totalCost: new FormControl(data? data.totalCost : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    tax: new FormControl(data? data.tax : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    srvDate: new FormControl(data? data.srvDate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    WarrantyExpireDate: new FormControl(data? data.WarrantyExpireDate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    purDate: new FormControl(data? data.purDate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    disposed: new FormControl(data? data.disposed : false, Validators.compose([Validators.required, noWhitespaceValidator()])),
    invSchCode: new FormControl(data? data.invSchCode : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    dispDate: new FormControl({ value: data? data.dispDatex : null, disabled: true }, Validators.compose([Validators.required, noWhitespaceValidator()])),
    bookID: new FormControl(data? data.bookID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    oldAstID: new FormControl(data? data.oldAstID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    insID: new FormControl(data? data.insID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    locID: new FormControl(data? data.locID : '5', Validators.compose([Validators.required, noWhitespaceValidator()])),
    invStatus: new FormControl(data? data.invStatus : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    isSold: new FormControl(data? data.isSold : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    sel_Date: new FormControl(data? data.sel_Date : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    sel_Price: new FormControl(data? data.sel_Price : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    soldTo: new FormControl(data? data.soldTo : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    astBrandId: new FormControl(data? data.astBrandId : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    astDesc: new FormControl({ value: data? data.astDesc : null, disabled: true }, Validators.compose([Validators.required, noWhitespaceValidator()])),
    astDesc1: new FormControl(data? data.astDesc1 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    astModel: new FormControl(data? data.astModel : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    companyID: new FormControl(data? data.companyID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    transRemarks: new FormControl(data? data.transRemarks : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    labelCount: new FormControl(data? data.labelCount : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    discount: new FormControl(data? data.discount : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    noPiece: new FormControl(data? data.noPiece : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    barCode: new FormControl(data? data.barCode : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    serialNo: new FormControl(data? data.serialNo : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    refCode: new FormControl(data? data.refCode : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    plate: new FormControl(data? data.plate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    poerp: new FormControl(data? data.poerp : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    capex: new FormControl(data? data.capex : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    grn: new FormControl(data? data.grn : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    glCode: new FormControl(data? data.glCode : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    poNumber: new FormControl(data? data.poNumber : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    astDesc2: new FormControl(data? data.astDesc2 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    capitalizationDate: new FormControl(data? data.capitalizationDate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    bussinessArea: new FormControl(data? data.bussinessArea : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    inventoryNumber: new FormControl(data? data.inventoryNumber : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    costCenterID: new FormControl(data? data.costCenterID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    inStockAsset: new FormControl(data? data.inStockAsset : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    evaluationGroup1: new FormControl(data? data.evaluationGroup1 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    evaluationGroup2: new FormControl(data? data.evaluationGroup2 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    evaluationGroup3: new FormControl(data? data.evaluationGroup3 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    evaluationGroup4: new FormControl(data? data.evaluationGroup4 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    createdBy: new FormControl(data? data.createdBy : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    isDataChanged: new FormControl(data? data.isDataChanged : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    lastInventoryDate: new FormControl(data? data.lastInventoryDate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    lastEditDate: new FormControl(data? data.lastEditDate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    creationDate: new FormControl(data? data.creationDate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    lastEditBy: new FormControl(data? data.lastEditBy : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld1: new FormControl(data? data.customFld1 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld2: new FormControl(data? data.customFld2 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld3: new FormControl(data? data.customFld3 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld4: new FormControl(data? data.customFld4 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld5: new FormControl(data? data.customFld5 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld6: new FormControl(data? data.customFld6 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld7: new FormControl(data? data.customFld7 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld8: new FormControl(data? data.customFld8 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    customFld9: new FormControl(data? data.customFld9 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    warranty: new FormControl(data? data.warranty : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    statusID: new FormControl(data? data.statusID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    disposalComments: new FormControl(data? data.disposalComments : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    imageBase64: new FormControl(data? data.imageBase64 : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    loginName: new FormControl(JSON.parse(localStorage.getItem('userObj')!).loginName, Validators.compose([Validators.required, noWhitespaceValidator()])),
    category: new FormControl(data? data.category : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    AssetsNum: new FormControl(data? data.AssetsNum : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    Hierarchy: new FormControl(data? data.Hierarchy : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    AssetType: new FormControl(data? data.AssetType : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    RFID: new FormControl(data? data.RFID : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    Age: new FormControl(data? data.Age : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    salvageValue: new FormControl(data? data.salvageValue : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    salvageValuePercent: new FormControl(data? data.salvageValuePercent : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    bookUpdateDate: new FormControl(data? data.bookUpdateDate : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    currentBV: new FormControl(data? data.currentBV : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    salvageMonth: new FormControl(data? data.salvageMonth : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    AccDeprec: new FormControl(data? data.AccDeprec : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    salvageYear: new FormControl(data? data.salvageYear : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    depDesc: new FormControl(data? data.depDesc : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
    description: new FormControl(data? data.description : null, Validators.compose([Validators.required, noWhitespaceValidator()])),
   });
  }

  constructor(
    private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router
  ) {
    this.detailFormInitilizer()
    this.detailForm.controls['disposed'].valueChanges.subscribe(res => {
      if(res) {
        this.detailForm.controls['astDesc'].enable()
        this.detailForm.controls['dispCode'].enable()
        this.detailForm.controls['dispDate'].enable()
      } else {
        this.detailForm.controls['astDesc'].disable()
        this.detailForm.controls['dispCode'].disable()
        this.detailForm.controls['dispDate'].disable()
      }
    })
  }
  sendingRequest: boolean = false;
  isEditMode: boolean = false
  save(){
    if (this.detailForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ?
        this.dataService.getTableData('Assets/UpdateAssetDetails', { update: 1, ...this.detailForm.value }) :
        this.dataService.getTableData('Assets/InsertAssetDetails', { add: 1, ...this.detailForm.value });
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/company-profile/companies'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      this.toast.show('Please fill all required field', 'Warning')
      validateAllFormFields(this.detailForm)
    }
  }

}
