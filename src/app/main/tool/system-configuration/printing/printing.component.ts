import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-printing',
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.scss']
})
export class PrintingComponent implements OnInit {
  @Input() public printingForm: FormGroup
  constructor() { }

  ngOnInit(): void {
  }

}
