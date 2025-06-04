import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { HttpService } from '../../shared/service/http.service';
import { finalize } from 'rxjs';
import { toastService } from '../../shared/toaster/toast.service';

@Component({
  selector: 'app-system-configuration',
  templateUrl: './system-configuration.component.html',
  styleUrls: ['./system-configuration.component.scss'],
})
export class SystemConfigurationComponent implements OnInit {
  form: FormGroup;
  id: any;
  submittingData: boolean = false;
  fetchingData = false
  constructor(private http: HttpService, private fb: FormBuilder, private toast:toastService) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  public currentStep = 0;

  @ViewChild('stepper', { static: true })
  public stepper: StepperComponent;

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  };

  private shouldValidate = (index: number): boolean => {
    return this.getGroupAt(index).touched && this.currentStep >= index;
  };

  public steps = [
    {
      label: 'General',
      isValid: this.isStepValid,
      // validate: this.shouldValidate,
    },
    {
      label: 'Asset Images',
      isValid: this.isStepValid,
      // validate: this.shouldValidate,
    },
    {
      label: 'Asset Description',
      isValid: this.isStepValid,
      // validate: this.shouldValidate,
    },
  ];

  initializeForm() {
    this.fetchingData = true
    this.form = this.fb.group({
      generalForm: new FormGroup({
        depreciationRunType: new FormControl(''),
        codingMode: new FormControl(''),
        dateFormat: new FormControl(''),
        exportToServer: new FormControl(''),
        deletePermanent: new FormControl(''),
        showAlarmOnStartup: new FormControl(''),
        alarmBeforeDays: new FormControl(0),
      }),
      assetImagesForm: new FormGroup({
        imgPath: new FormControl(''),
        imgStorageLoc: new FormControl(''),
        imgType: new FormControl(''),
      }),
      assetDescriptionForm: new FormGroup({
        descForReport: new FormControl(''),
        descForLabelPrinting: new FormControl(''),

      }),
      
    });
    this.http.httpPost('SysConfig/GetSysConfigInfo', { get: 1 })
    .pipe(finalize(() => this.fetchingData = false)).subscribe({
      next: (res) => {
        this.id = res[0]?.id
        console.log("=================")
        console.log(res[0]?.descForLabelPrinting)
        this.form.patchValue({
          generalForm: {
            depreciationRunType: res[0]?.depRunType,
            codingMode: res[0]?.codingMode,
            dateFormat: res[0]?.dtFormat ?? '',
            exportToServer: res[0]?.exportToServ ?? '',
            deletePermanent: res[0]?.deletePermt ?? '',
            showAlarmOnStartup: res[0]?.showAlarmOnStartup,
            alarmBeforeDays: res[0]?.alarmBeforeDays ?? 0,
          },
          assetImagesForm: {
            imgPath: res[0]?.imgPath,
            imgStorageLoc: res[0]?.imgStorgeLoc,
            imgType: res[0]?.imgType,
          },
          assetDescriptionForm: {
            descForReport: res[0]?.descForRpt,
            descForLabelPrinting: res[0]?.descForLabelPrinting === true ? 'true' : 'false'
          },
        });
      },
    });
  }

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  public next(): void {
    console.log(this.form.value);
    if (this.currentGroup.valid && this.currentStep !== this.steps.length) {
      this.currentStep += 1;
      return;
    }

    this.currentGroup.markAllAsTouched();
    this.stepper.validateSteps();
  }

  public prev(): void {
    this.currentStep -= 1;
  }

  public submit(): void {
    if (!this.currentGroup.valid) {
      this.currentGroup.markAllAsTouched();
      this.stepper.validateSteps();
    }
    if (this.form.valid) {
      this.submittingData = true
      this.form.value.generalForm.deletePermanent = +this.form.value.generalForm.deletePermanent;
      // console.log('this.form.controls.value',this.form.value.generalForm.deletePermanent);
      // this.form.generalForm.value.deletePermanent = +this.form.get('generalForm')?.value.deletePermanent
      console.log(this.form.get('generalForm')?.value.deletePermanent, 'hehe');
      const payload = {
        ...this.form.get('generalForm')?.value,
        ...this.form.get('assetImagesForm')?.value,
        ...this.form.get('assetDescriptionForm')?.value,
        loginName : JSON.parse(localStorage.getItem('userObj')!).loginName,
        id: this.id,
        Update: 1
      }

      console.log(payload)
      this.http.httpPost('SysConfig/UpdateSysConfigInfo',payload)
      .pipe(finalize(() => this.submittingData = false))
      .subscribe({
        next:(res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success')
          } else {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error')
        },
        complete:() => {
          this.currentStep = 0
          this.initializeForm()
        }
      })
    }
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map((groupName) =>
      this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }
}
