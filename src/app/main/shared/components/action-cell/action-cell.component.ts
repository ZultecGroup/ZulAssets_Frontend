import { Component, inject } from '@angular/core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ActionCellService } from '../../service/action-cell.service';
import { GridType } from '../../dtos/GridType/GridType';

@Component({
  selector: 'app-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: [ './action-cell.component.scss' ]
})
export class ActionCellComponent implements ICellRendererAngularComp
{

  faEdit = faEdit;
  faTrash = faTrash
  rowData = {};
  gridName: string = '';
  permissions: any;

  actionCellService = inject(ActionCellService)

  agInit(params: any): void
  {
    this.gridName = params.gridName;
    this.rowData = params.data;
    this.permissions = params.permissions;
  }

  refresh(params?: any): boolean
  {
    return true;
  }

  onClick(event: MouseEvent, data: any, isPrimary: boolean): void
  {
    if (isPrimary)
    {
      this.actionCellService.onPrimaryClicked({ gridName: this.gridName, rowData: data })
    } else
    {
      this.actionCellService.onSecondaryClicked({ gridName: this.gridName, rowData: data })
    }
  }
}
