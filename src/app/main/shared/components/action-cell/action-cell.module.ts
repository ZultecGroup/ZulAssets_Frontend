import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActionCellComponent } from './action-cell.component';

@NgModule({
  declarations: [
    ActionCellComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})

export class ActionCellModule { }
