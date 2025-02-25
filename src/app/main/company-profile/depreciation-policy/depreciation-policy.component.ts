import { GeneralService } from 'src/app/main/shared/service/general.service';
import { Component, OnInit } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import { first, finalize } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { toastService } from '../../shared/toaster/toast.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator, validateAllFormFields } from '../../shared/helper/functions.component';



@Component({
  selector: 'app-depreciation-policy',
  templateUrl: './depreciation-policy.component.html',
  styleUrls: ['./depreciation-policy.component.scss']
})
export class DepreciationPolicyComponent implements OnInit {
  fetchingData: boolean = false;
  isEditMode: any = false;
  categoriesupdate: boolean = true;


  public editItem: any = null;
  category: string;
  salvageYear: string;
  salvageMonth: string;
  catDepID: string;
  salvageYearInPer: string;
  salvageValue: string;
  depreciationPolicyForm!: FormGroup;
  sendingRequest: boolean;
  constructor(private tableDataService: TableDataService, private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,private fb: FormBuilder, public GeneralService: GeneralService) {
  }
  ngOnInit(): void {
    this.initializeDepreciationPolicyForm();
  }
  initializeDepreciationPolicyForm() {
    this.depreciationPolicyForm = this.fb.group({
      category: ['', [Validators.required, noWhitespaceValidator()]],
      catDepID: ['', [Validators.required, noWhitespaceValidator()]],
      salvageValue: ['', [Validators.required, noWhitespaceValidator()]],
      salvagePercent: ['', [Validators.required, noWhitespaceValidator()]],
      salvageMonth: ['',[Validators.required, noWhitespaceValidator()]],
      salvageYear: ['',[Validators.required, noWhitespaceValidator()]],
      // astCatID: [this.editItem?.astCatID],
    })
  }

  showEditor(node: any) {
    this.editItem = node;
    this.category = this.editItem.astCatDesc;
    console.log(this.editItem)
    this.GetDepPolicyAgainstAstCatID(this.editItem.astCatID)
  }
  GetDepPolicyAgainstAstCatID(astCatID: any) {
    // this.fetchingData = true
    this.tableDataService.getTableData('DepreciationMethod/GetDepPolicyAgainstAstCatID', { get: 1, searching: 1, var: "",astCatID:astCatID})
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          if (res) {
            if (res.length > 0) {
              this.isEditMode = true;
              this.salvageYear = res[0].salvageYear;
              this.salvageValue = res[0].salvageValue;
              this.salvageYearInPer = res[0].salvagePercent;
              this.salvageMonth = res[0].salvageMonth;
              this.depreciationPolicyForm.controls['catDepID'].setValue(res[0].catDepID);
            } else {
              this.salvageYear = "";
              this.salvageValue = "";
              this.salvageYearInPer = "";
              this.salvageMonth = "";
              this.catDepID = "";
            }

          }
        }, error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }
  onSubmit() {
    if (this.depreciationPolicyForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.isEditMode ? this.tableDataService.getTableData('DepreciationMethod/UpdateDepPolicy', { update: 1, ...this.depreciationPolicyForm.value }) :  this.tableDataService.getTableData('DepreciationMethod/InsertDepPolicy', { add: 1, ...this.depreciationPolicyForm.value, astCatID: this.editItem.astCatID})
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              // this.router.navigate(['main/master-data/asset-items'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
          }
        })
    } else {
      validateAllFormFields(this.depreciationPolicyForm)
    }
  }

}
