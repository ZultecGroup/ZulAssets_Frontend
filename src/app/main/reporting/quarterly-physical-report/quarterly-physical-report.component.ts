import { GeneralService } from './../../shared/service/general.service';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';

import { FormControl } from '@angular/forms';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import {
  LocationsDto,
  LocationsDtoResponse,
} from 'src/app/main/shared/dtos/Location/LocationsDto';
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
import autoTable from 'jspdf-autotable';

import 'jspdf-autotable';
import { debug } from 'console';
@Component({
  selector: 'app-quarterly-physical-report',
  templateUrl: './quarterly-physical-report.component.html',
  styleUrls: ['./quarterly-physical-report.component.scss']
})

export class QuarterlyPhysicalReportComponent implements OnInit {
  @ViewChild('chkCount') chkCount!: ElementRef<HTMLInputElement>;
  @ViewChild('chkTransferred') chkTransferred!: ElementRef<HTMLInputElement>;
  @ViewChild('chkMissing') chkMissing!: ElementRef<HTMLInputElement>;
  @ViewChild('perChkFound') perChkFound!: ElementRef<HTMLInputElement>;
  @ViewChild('chkFound') chkFound!: ElementRef<HTMLInputElement>;

 constructor(
    private route: ActivatedRoute,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    public tableDataService: TableDataService,
    private router: Router,
    public GeneralService: GeneralService
    
  ) {}
  LocID: any;
  Hierarchy: any;
  LocationIDs: string[] = []; // Use 'number[]' or 'string[]' if you know the type of custodianID
  searchText: string = '';
  
  apiUrl: any;
  

  // Event handler when the search text changes
  onFilterTextBoxChanged() {
    console.log(this.searchText);
    // Here, you would filter assetData based on the search text
  }
  
  QuarterList = [
    { id: null, name: 'Select Quarter' },
    { id: '01', name: 'Q1' },
    { id: '04', name: 'Q2' },
    { id: '07', name: 'Q3' },
    { id: '10', name: 'Q4' }
  ];

  YearList: { id: number; name: string }[] = [];

  SelectedQuarter: string | null = null;
  ngOnInit(): void {
    
    this.getAllLocations();
    const currentYear = new Date().getFullYear();
    this.YearList = [
      { id: 0, name: 'Select Year' }, // 👈 placeholder item
      ...Array.from({ length: 4 }, (_, i) => {
        const year = currentYear - i;
        return { id: year, name: year.toString() };
      })
    ];
    
  }
  
  SelectedYear= 0;
  fetchingData: boolean = false;
  allLocation: LocationsDto[] = [];
dataLocation: any[] = [];
LocationID: any = null; // or undefined
  
getAllLocations() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Locations/GetAllLocationsOfLocLevel0', { loginName: "admin"})
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: LocationsDto[]) => {
          if (res) {
            this.dataLocation = [
              { locID: null, locDesc: 'Select Region' }, // 👈 Placeholder (default selected)
              { locID: 0, locDesc: 'All' },                 // 👈 Real "All" option
               ...res];
            console.log('Locations loaded:', this.dataLocation);
            this.LocationID = null; // reset selection to trigger placeholder
          }
        
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  handleLocation(value: any) {
    
    this.dataLocation = this.allLocation.filter(
      (s: any) =>
        s.locDesc.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  
  SelectedStatus: any;

  StatusList = [
    { id: null, name: 'Select Status' },
    { id: 'InProcess', name: 'In Process' },
    { id: 'Open', name: 'Open' },
    { id: 'Close', name: 'Close' }
  ];

  
  gridView: any[] = []; // Populate with your data
       // holds the row data
  assetGridCols: any[] = [];     // holds the dynamically generated column definitions

  defaultColDefs = {
    sortable: true,
    filter: true,
    resizable: true
  };
  private gridApi!: GridApi;

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;

  }

  handleApiResponse(response: any[]) {
    if (response && response.length > 0) {
      this.gridView = response;
  
      this.assetGridCols = Object.keys(response[0])
      .filter(key => key !== 'locID') // Exclude 'locID'
      .map(key => ({
        headerName: key === 'locDesc' ? 'Region' : this.toHeaderName(key),
        field: key,
        sortable: true,
        filter: true,
        resizable: true

      }));
  } else {
    this.gridView = [];
    this.assetGridCols = [];
  }
  }
  checkIfChecked() {
    // const chkCountisChecked = this.chkCount.nativeElement.checked;
    // const chkTransferredisChecked = this.chkTransferred.nativeElement.checked;
    // const chkMissingisChecked = this.chkMissing.nativeElement.checked;
    // const chkFoundisChecked = this.chkFound.nativeElement.checked;
    // console.log('Checked:', chkCountisChecked ? 1 : 0); // 1 if checked, 0 if not
  }

  toHeaderName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')            // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  }
  onSearch() {
    
    if ( this.LocationID === null) {
      this.toast.show('Please select Region first', 'warning');

      return;
    }

    console.log(this.LocationID)
    const chkCountValue = this.chkCount.nativeElement.checked ? 1 : 0;
const chkTransferredValue = this.chkTransferred.nativeElement.checked ? 1 : 0;
const chkMissingValue = this.chkMissing.nativeElement.checked ? 1 : 0;
const chkFoundValue = this.chkFound.nativeElement.checked ? 1 : 0;
const perChkFoundValue = this.perChkFound.nativeElement.checked ? 1 : 0;

const payloadd = {
      locId:this.LocationID,
      assetsCountColumn: chkCountValue,
      assetFoundColumn: chkFoundValue,
      assetTransferredColumn: chkTransferredValue,
      assetMissingColumn: chkMissingValue,
      assetFoundPercentage: perChkFoundValue,
      year: this.SelectedYear === 0 ? '' : this.SelectedYear.toString(),
      quarterly:this.SelectedQuarter === null ? '' : this.SelectedQuarter,
      loginName: "admin"
    };
   
console.log(payloadd)

this.apiUrl = "Report/QuarterlyReport";

    this.tableDataService
    .getTableDataWithPagination(this.apiUrl, payloadd)
    .pipe(
      first(),
      finalize(() => (this.fetchingData = false))
    )
    .subscribe({
      next: (res: any) => {
        if (res) {
          debugger
         console.log(res)
          this.handleApiResponse(res);  // Process the response and update the grid data
        }
      },
      error: (err) =>
        this.toast.show(err ?? 'Something went wrong!', 'error'),
    });

    console.log('Payload to send:', JSON.stringify(payloadd, null, 2));
    
  }
  exportToExcel() {
    this.gridApi.exportDataAsCsv({
      fileName: 'Quarterly_Physical_Report.csv',
      columnKeys: this.assetGridCols.map(col => col.field) // Optional: limit/export specific fields
    });
  }

  exportToPDFClick() {
    const doc = new jsPDF();
    const base64Logo = 'data:image/png;base64,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';// your base64 image here

    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 30;
    const logoHeight = 20;
    const margin = 10;
  
    // ✅ Add logo to top-right
    doc.addImage(
      base64Logo,
      'PNG',
      pageWidth - logoWidth - margin, // x-position (right-aligned)
      margin,                         // y-position
      logoWidth,
      logoHeight
    );
  
    // Add the title next to the logo
    doc.setFontSize(16);
    doc.text('Quarterly Physical Report', 60, 30); // Align with logo height
    doc.setLineWidth(0.7); // Thicker than default
    doc.line(14, 32, 198, 32); // x1, y1, x2, y2 (left to right across page)
    doc.setLineWidth(0.1); // Reset to default after line
    // Start table after logo and title
    const startY = 35;
    const columnDefs = this.gridApi.getColumnDefs() as any[];
    const headers = columnDefs.map(col => col.headerName);

    // Get all rows (current view)
    const rowData: any[] = [];
    this.gridApi.forEachNode((node) => {
      const row = columnDefs.map(col => node.data[col.field]);
      rowData.push(row);
    });

    autoTable(doc, {
      startY: startY,

      head: [headers],
      body: rowData,
      theme: 'grid',
      headStyles: {
        fillColor: [173, 216, 230],
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
      //  lineWidth: 0.1,
        halign: 'center',
      },
      bodyStyles: {
        textColor: [0, 0, 0],       // Black text in body
        lineColor: [0, 0, 0],       // Black grid lines in body
      },
      styles: {
        lineWidth: 0.1              // Optional: adjust thickness of grid lines
      }
      
    });

    doc.save('grid-export.pdf');
    return
    if (!this.gridView || this.gridView.length === 0 || this.LocationIDs.length===0) {
      this.toast.show('Please search first', 'warning');

      return;
    }
    const payload = {
      location: this.LocationIDs.map(id => ({
        locationID: id
      }))
    };
    
    this.apiUrl = "Report/AssetStatementReport";

    this.tableDataService
    .getTableDataWithPagination(this.apiUrl, payload)
    .pipe(
      first(),
      finalize(() => (this.fetchingData = false))
    )
    .subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res)
          
          // if(isExport){
          //   this.exportData = res.data;

          // }
          // else {
            // this.reportGridView = res.data;
            // this.paginationReport.totalItems = res.totalRowsCount;
            // this.summaryCountData = res.summaryCountData;
            // this.getAllReportData(true);

          //}
         //  // Process the response and update the grid data
        }
      },
      error: (err) =>
        this.toast.show(err ?? 'Something went wrong!', 'error'),
    });

    console.log('Payload to send:', JSON.stringify(payload, null, 2));
    // You can now send this.custodianIDs to the server or use them in filtering
  }

  


groupBy(array: any[], key: string) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
  }
}
    