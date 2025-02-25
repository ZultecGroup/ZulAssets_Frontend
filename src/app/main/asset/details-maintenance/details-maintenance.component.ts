import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { finalize, first } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { AssetsInformationComponent } from './assets-information/assets-information.component';

@Component({
  selector: 'app-details-maintenance',
  templateUrl: './details-maintenance.component.html',
  styleUrls: ['./details-maintenance.component.scss'],
})
export class DetailsMaintenanceComponent implements OnInit {
  @ViewChild('firstChild') firstChildComponent!: AssetsInformationComponent;

  detailsMaintenanceData: any;
  selectedTab = 0;
  astID: any;

  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private tableDataService: TableDataService
  ) {}

  ngOnInit(): void {}

  async onTabSelect(e: SelectEvent): Promise<void> {
    if (this.selectedTab === 0 && this.firstChildComponent) {
      // Validate the form in the first tab
      if (!this.firstChildComponent.validateForm()) {
        e.preventDefault();
        return; // Prevent tab change if form is invalid
      }

      // Handle saving changes or submitting data
      e.preventDefault();
      const shouldProceed = await this.handleTabChangeWithConfirmation();
      if (!shouldProceed) {
        e.preventDefault();
        return; // Prevent tab change if confirmation declined
      }
    }

    // Update the selected tab index
    this.selectedTab = e.index;
  }

  async handleTabChangeWithConfirmation(): Promise<boolean> {
    if (!this.firstChildComponent.isEditMode) {
      const confirmed = await this.confirmationDialogService.customDialog(
        'Do you want to save these changes?'
      );

      if (!confirmed) {
        return false;
      }
    }else{
      this.firstChildComponent.onDistroy = true;
    }

    try {
      const data = await this.firstChildComponent.submit();
      this.detailsMaintenanceData = data; // Update parent data
      return true;
    } catch (error) {
      alert('Failed to fetch data from child.');
      return false;
    }
  }

  async NextTabButton(): Promise<void> {
    if (this.selectedTab < 7) {
      if (this.selectedTab === 0 && this.firstChildComponent) {
        // Validate the form in the first tab
        if (!this.firstChildComponent.validateForm()) {
          return; // Prevent tab change if form is invalid
        }

        // Handle saving changes or submitting data
        const shouldProceed = await this.handleTabChangeWithConfirmation();
        if (!shouldProceed) {
          return; // Prevent tab change if confirmation declined
        }
      }

      // Increment the selected tab index
      this.selectedTab++;
    }
  }

  PreviousTabButton(): void {
    if (this.selectedTab > 0) {
      this.selectedTab--;
    }
  }

  getAstID(data: any): void {
    this.astID = data;
  }

  getDetailsMaintenanceData(data: any): void {
    this.detailsMaintenanceData = data;
  }
}
