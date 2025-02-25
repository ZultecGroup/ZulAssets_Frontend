import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, first, map } from 'rxjs';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-device-config',
  templateUrl: './add-device-config.component.html',
  styleUrls: ['./add-device-config.component.scss']
})
export class AddDeviceConfigComponent implements OnInit {

  sendingRequest: boolean = false;
    deviceId!: number;
    fetchingData: boolean = false;
  deviceDesc: any;
  type: any;
  status: any;
  licKey: any;
  serialNo: any;
  deviceSNo: any = "";
devicePhoneNo: any = "";
    constructor(private route: ActivatedRoute, private fb: FormBuilder, private dataService: TableDataService,
      private toast: toastService, private router: Router) { }
    pagination = {
      currentPage: 1,
      pageSize: 15,
      totalItems: 0,
    }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.deviceId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

      this.deviceInfoById()
  }

  deviceInfoById() {
    this.fetchingData = true;

    this.dataService.getTableData('DeviceConfiguration/GetAllDevices', { get: 1, searching:1, var:this.deviceId })
      .pipe(
        map((deviceList: any) =>
          deviceList.data.find((device: any) => device.deviceID == this.deviceId)),
        first(),
        finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) =>
        {
          this.deviceDesc = res?.deviceDesc
          this.type = res?.comType
          this.status = res?.status
          this.licKey = res?.licKey
          this.serialNo = res?.hardwareID
          this.deviceSNo = res?.deviceSerialNo
          this.devicePhoneNo =res?.devicePhNo
        }
      })
  }
   onSubmit() {

        this.sendingRequest = true
        this.dataService.getTableData('DeviceConfiguration/UpdateDevice', {
          update: 1,
          deviceDesc: this.deviceDesc,
          deviceSerialNo: this.serialNo,
          deviceID: this.deviceId,
          licKey: this.licKey,
          devicePhNo: this.devicePhoneNo,
          deviceSrNo: this.deviceSNo,
         })
        .pipe(finalize(() => this.sendingRequest = false))
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success')
                this.router.navigate(['main/tool/device-configuration'])
              } else {
                this.toast.show(res.message, 'error')
              }
            },
            error: (err) => {
              console.log(err);
              this.toast.show(err.error.message, 'error')
            }
          })

    }
}
