import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, first, finalize } from 'rxjs';
import { OrganizationLevelsDto, OrgLevelsDtoResponse } from 'src/app/main/shared/dtos/OrganizationLevels.ts/OrganizationLevel';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-levels',
  templateUrl: './add-update-levels.component.html',
  styleUrls: ['./add-update-levels.component.scss'],
})
export class AddUpdateLevelsComponent implements OnInit {
  LevelForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  lvlID!: number;
  fetchingData: boolean = false;

  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: TableDataService,
    private toast: toastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.lvlID = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.lvlID;
    this.initializeLevelForm();
    if (this.isEditMode) {
      this.getLevelById();
    }
  }
  getLevelById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize
    }
    this.dataService.getTableDataWithPagination('Levels/GetAllLevels', { get: 1, paginationParam })
      .pipe(
        map((levelsList: OrgLevelsDtoResponse) =>
          levelsList.data.find((level: OrganizationLevelsDto) => level.lvlID == this.lvlID)
        ),
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          this.LevelForm.patchValue({
            lvlID: res?.lvlID,
            lvlDesc: res?.lvlDesc,
          });
        },
      });
  }

  initializeLevelForm() {
    this.LevelForm = this.fb.group({
      lvlID: [0],
      lvlDesc: ['', [Validators.required, noWhitespaceValidator()]],
    });
  }

  onSubmit() {
    if (this.LevelForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.isEditMode
        ? this.dataService.getTableData('Levels/UpdateLevel', {
            update: 1,
            ...this.LevelForm.value,
          })
        : this.dataService.getTableData('Levels/InsertLevel', {
            add: 1,
            ...this.LevelForm.value,
          });
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.router.navigate(['main/company-profile/levels']);
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
          // Object.values(err.errors).forEach((error: any) => this.toast.show(error.toString(), 'error'))
        },
      });
    } else {
      validateAllFormFields(this.LevelForm);
    }
  }
}
