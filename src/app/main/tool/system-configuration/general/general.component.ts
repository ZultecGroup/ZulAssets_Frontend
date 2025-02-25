import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit, OnChanges {
  @Input() public generalForm: FormGroup;
  @Input() data: any;
  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.data);
    this.generalForm.patchValue({
      depRunType: this.data?.depRunType ?? "",
      codingMode: this.data.codingMode ?? "",
      dateFormat: this.data.dateFormat ?? "",
      exportToServer: this.data.exportToServer ?? "",
      deletePermanent: this.data.deletePermanent ?? "",
      showAlarmOnStartup: this.data.showAlarmOnStartup === true ? 1 : 0,
      alarmBeforeDays: this.data.alarmBeforeDays ?? "",
    });
  }
}
