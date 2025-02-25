import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, first, finalize } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-organization-hierarchy',
  templateUrl: './add-update-organization-hierarchy.component.html',
  styleUrls: ['./add-update-organization-hierarchy.component.scss']
})
export class AddUpdateOrganizationHierarchyComponent implements OnInit {

  OrganizationHierarchyForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  orgHierID!: number;
  fetchingData: boolean = false;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService, private toast: toastService, private router: Router) { }

  ngOnInit(): void {
    this.orgHierID = this.route.snapshot.params['id']
    this.isEditMode = !!this.orgHierID;
    this.initializeOrganizationHierarchyForm();
    if (this.isEditMode) {
      this.getOrganizationHierarchyById()
    }
  }
  getOrganizationHierarchyById() {
    this.fetchingData = true;
    this.dataService.getTableData('OrgHier/GetAllOrgHier', { get: 1 })
      .pipe(
        map(OrgHiersList =>
          OrgHiersList.find((orgHier: any) => orgHier.orgHierID == this.orgHierID)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          this.OrganizationHierarchyForm.patchValue({
            orgHierID: res.orgHierID,
            orgHierName: res.orgHierName
          })
        }
      })
  }

  initializeOrganizationHierarchyForm() {
    this.OrganizationHierarchyForm = this.fb.group({
      orgHierID: [0],
      orgHierName: ['', [Validators.required, noWhitespaceValidator()]]
    })
  }

  onSubmit() {
    if (this.OrganizationHierarchyForm.valid) {
      this.sendingRequest = true
      const apiCall$ = this.isEditMode ? this.dataService.getTableData('OrgHier/UpdateOrgHier', { update: 1, ...this.OrganizationHierarchyForm.value }) : this.dataService.getTableData('OrgHier/InsertOrgHier', { add: 1, ...this.OrganizationHierarchyForm.value })
      apiCall$.pipe(finalize(() => this.sendingRequest = false))
        .subscribe({
          next: (res) => {
            if (res && res.status === '200') {
              this.toast.show(res.message, 'success')
              this.router.navigate(['main/master-data/organization-hierarchy'])
            } else {
              this.toast.show(res.message, 'error')
            }
          },
          error: (err) => {
            this.toast.show(err.title, 'error')
            // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
          }
        })
    } else {
      validateAllFormFields(this.OrganizationHierarchyForm)
    }
  }
}
