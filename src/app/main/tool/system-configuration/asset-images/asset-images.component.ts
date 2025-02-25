import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-asset-images',
  templateUrl: './asset-images.component.html',
  styleUrls: ['./asset-images.component.scss']
})
export class AssetImagesComponent implements OnInit {
  @Input() public assetImagesForm: FormGroup
  constructor() { }

  ngOnInit(): void {
  }

}
