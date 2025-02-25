import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-assets-description',
  templateUrl: './assets-description.component.html',
  styleUrls: ['./assets-description.component.scss']
})
export class AssetsDescriptionComponent implements OnInit {
  @Input() public assetDescriptionForm: FormGroup
  constructor() { }

  ngOnInit(): void {
  }

}
