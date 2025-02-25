import { GeneralService } from './../../shared/service/general.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';

import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  Subject,
} from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-audit-status-reports',
  templateUrl: './audit-status-reports.component.html',
  styleUrls: ['./audit-status-reports.component.scss'],
})
export class AuditStatusReportsComponent implements OnInit {
  gridData: any[] = [];
  gridView: any[] = [];
  reportGridView: any[] = [];
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  generateReportButton: boolean = true;
  searchText: string = '';
  searchSubject = new Subject<string>();
  inventorySchedulesGridCols: ColDef[] = [];
  reportGridCols: ColDef[] = [];
  selectedRowIds: Set<number> = new Set();
  selectedRowsMap: Map<number, any> = new Map(); // Key is a unique identifier like rowNo or invSchCodes

  defaultColDefs: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  isDestroyed$: Subject<boolean> = new Subject();
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [15, 30, 50, 100, 200, 500],
  };
  paginationReport = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
    pageSizes: [15, 30, 50, 100, 200, 500],
  };
  faFileExcel = faFileExcel;
  faFilePdf = faFilePdf;
  private gridApi!: GridApi;

  private gridDataService = inject(GridDataService);
  selectedReport: any;
  reportsDD: any;
  apiUrl: any;
  reportName: any;
  summaryCountData: any;
  gridApiReport!: GridApi;
  posted: boolean;
  postedCheckboxVisible: boolean;

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private route: ActivatedRoute,
    public GeneralService: GeneralService,
    private modalService: NgbModal
  ) {
    this.inventorySchedulesGridCols = this.gridDataService.getColumnDefs(
      GridType.ReportingAudit,
      this.GeneralService.permissions['Audit Status Reports']
    );
    this.reportGridCols = this.gridDataService.getColumnDefs(
      GridType.ReportingAuditResult,
      this.GeneralService.permissions['Audit Status Reports']
    );
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams as Params;

    const currentPage = Number(
      queryParams['currentPage'] ?? this.pagination.currentPage
    );
    const pageSize = Number(
      queryParams['pageSize'] ?? this.pagination.pageSize
    );

    this.getAllSchedules(currentPage, pageSize);
    this.getAllReports();
    this.searchHandler();
  }

  private searchHandler() {
    this.searchSubject
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((term) => {
        this.searchText = term;
        this.getAllSchedules(1, this.pagination.pageSize);
      });
  }

  getAllReportData() {
    this.fetchingData = true;
    let rptAllAstsTree: any = [];
    this.gridApi.getSelectedRows().map((x: any) => {
      rptAllAstsTree.push({
        invSchCode: x.invSchCode,
        invLoc: x.locTrees,
      });
    });

    let payload: any = {
      rptAllAstsAuditTree: rptAllAstsTree,
      posted: this.posted,
      paginationParam: {
        pageIndex: this.paginationReport.currentPage,
        pageSize: this.paginationReport.pageSize,
      },
    };
    this.tableDataService
      .getTableDataWithPagination(this.apiUrl, payload)
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.reportGridView = res.data;
            this.paginationReport.totalItems = res.totalRowsCount;
            this.summaryCountData = res.summaryCountData;
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  ngOnDestroy() {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
  }

  getAllSchedules(currentPage: number, pageSize: number) {
    this.fetchingData = true;

    let payload: any = {
      get: 1,
      paginationParam: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    };

    if (this.searchText !== '') {
      payload = {
        ...payload,
        searching: 1,
        var: this.searchText,
      };
    }

    this.tableDataService
      .getTableDataWithPagination('InvSch/GetAllInvSchs', payload)
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.gridData = res.data.reverse();
            this.gridView = this.gridData.reverse();
            this.pagination.currentPage = currentPage;
            this.pagination.pageSize = pageSize;
            this.pagination.totalItems = res.totalRowsCount;
            setTimeout(() => this.reapplySelection(), 0); // Reapply selection after the grid refresh
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllReports() {
    this.fetchingData = true;

    this.tableDataService
      .getTableDataGet('Report/GetAllAuditReportsDD')
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.reportsDD = res;
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.showLoadingOverlay();
  }
  onGridReadyReport(params: GridReadyEvent) {
    this.gridApiReport = params.api;
  }

  onFilterTextBoxChanged() {
    this.searchSubject.next(this.searchText);
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    this.getAllSchedules(this.pagination.currentPage, this.pagination.pageSize);
  }

  public pageChangeReport(event: number): void {
    this.paginationReport.currentPage = event;
    this.getAllReportData();
  }

  pageSizeChange(event: number) {
    this.resetPaginator();
    this.pagination.pageSize = event;
    this.getAllSchedules(this.pagination.currentPage, this.pagination.pageSize);
  }

  pageSizeChangeReport(event: number) {
    this.resetPaginatorReport();
    this.paginationReport.pageSize = event;
    this.getAllReportData();
  }

  private resetPaginator() {
    this.pagination.currentPage = 1;
    this.pagination.totalItems = 0;
  }

  private resetPaginatorReport() {
    this.paginationReport.currentPage = 1;
    this.paginationReport.totalItems = 0;
  }

  exportToCSV(): void {
    // this.gridApiReport.exportDataAsCsv();
    // this.gridApiReport.exportDataAsExcel();
    this.gridDataService.exportToCSV(this.gridApiReport, GridType.ReportingAuditResult);
  }

  onSelectionChanged() {
    const selectedNodes = this.gridApi.getSelectedNodes();

    // Add newly selected rows to the global map
    selectedNodes.forEach((node) => {
      if (node.data && node.data.invSchCode) {
        this.selectedRowsMap.set(node.data.invSchCode, node.data);
      }
    });

    // Remove rows no longer selected from the map
    const deselectedNodes = this.gridApi
      .getRenderedNodes()
      .filter((node) => !node.isSelected());
    deselectedNodes.forEach((node) => {
      if (node.data && node.data.invSchCode) {
        this.selectedRowsMap.delete(node.data.invSchCode);
      }
    });

    console.log(
      'Global Selected Rows Map:',
      Array.from(this.selectedRowsMap.values())
    );
  }

  reapplySelection() {
    this.gridApi.forEachNode((node) => {
      if (node.data && this.selectedRowsMap.has(node.data.invSchCode)) {
        node.setSelected(true);
      }
    });
  }

  onReportChange(selectedValue: any): void {
    console.log('selectedReport', this.selectedReport);
    console.log(
      'this.gridApi.getSelectedRows()',
      this.gridApi.getSelectedRows()
    );
    // Find the selected data object from the `reportsDD` array
    const selectedData = this.reportsDD.find(
      (report: any) => report.id === selectedValue
    );

    if (selectedData) {
      this.apiUrl = selectedData.apiUrl;
      this.postedCheckboxVisible = selectedData.postedCheckboxVisible;
      this.reportName = selectedData.reportName;
      console.log('Selected Report:', selectedData);
      this.generateReportButton = false;
      // Perform any logic with the selected data
    } else {
      console.error('No matching report found!');
    }
  }

  generateReport() {
    this.getAllReportData();
    // Open the modal
    // this.modalService.open(modalContent); // Opens the modal


// const element = document.getElementById('myModal') as HTMLElement;
// const myModal = new Modal(element);
// myModal.show();
  }

  exportToPDF() {
    const doc = new jsPDF('l');

    const boxWidth = 40;
    const boxHeight = 30;
    const margin = 5;  // Margin between the boxes
    let currentX = margin; // Start at the left edge of the page

    // Add Custom Boxes with Counts in One Row
    this.summaryCountData.forEach((count: any, index: any) => {
      doc.setFillColor(200, 220, 255); // Light Blue
      doc.rect(currentX, 15, boxWidth, boxHeight, 'F'); // Draw a filled box at currentX position
      doc.setTextColor(0, 0, 0); // Black text color
      doc.text(count.statusDesc, currentX + 5, 25); // Status Description
      doc.text(String(count.statusCount), currentX + 5, 30); // Status Count

      // Update the current X position for the next box
      currentX += boxWidth + margin; // Add width of box and margin to move to next position
    });

    // Now add the table below the boxes
    const tableStartY = 50; // Position the table below the boxes

    const exportData: any[] = [];

    // Extract row data
    this.gridApiReport.forEachNode((rowNode: any) => {
      exportData.push(rowNode.data);
    });

    // Map column headers and row data
    const headers = this.reportGridCols.map(col => col.headerName);

    const rows = exportData.map(row =>
      this.reportGridCols.map((col: any) => row[col.field])
    );

    // Add AutoTable to PDF
    doc.text('All Asset Report', 12, 10);
    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: tableStartY,
      // startY: 20,
      theme: 'striped',
      styles: { fontSize: 10 },
    bodyStyles: { valign: 'top' },
    horizontalPageBreak: true,
    horizontalPageBreakBehaviour: 'immediately',
    });

    // Save the PDF
    doc.save('all-asset.pdf');
  }

  exportToCSVWithBoxes() {

    const gridCsv = this.gridApiReport.getDataAsCsv(); // Export the ag-Grid data to CSV
console.log('exportDataAsCsv', gridCsv);
    // Custom boxes data
    const boxesData = this.summaryCountData.map((count: any) => {
      return `${count.statusDesc}: ${count.statusCount}`; // Format the custom data (boxes) as CSV
    }).join(', '); // Join them into a single string (you can also add a newline here if you prefer)

    // Combine the custom data with the grid CSV data
    const finalCsv = `${boxesData}\n\n${gridCsv}`;

    // Create a blob with the final CSV content
    const blob = new Blob([finalCsv], { type: 'text/csv' });

    // Create an object URL and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report-with-boxes.csv'; // File name for the download
    link.click(); // Trigger the download
  }
}
