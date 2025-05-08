import { Component, inject, OnInit } from '@angular/core';
import { TableDataService } from '../../shared/service/table-data.service';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  Subject,
  takeUntil,
} from 'rxjs';
import { toastService } from '../../shared/toaster/toast.service';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import * as XLSX from 'xlsx';
import { log } from 'console';

@Component({
  selector: 'app-import-file',
  templateUrl: './import-file.component.html',
  styleUrls: ['./import-file.component.scss'],
})
export class ImportFileComponent implements OnInit {
  defaultColDefs: any = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  gridApi: any;
  sendingRequest: boolean;

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  rowData: any[] = []; // AG Grid row data
  columnDefs: any = []; // AG Grid column definitions
  headers: string[] = []; // Headers of the uploaded file
  requiredHeaders: string[] = [
    // Required columns for validation
    'CUSTODIAN NAME',
    'CUSTODIAN CODE',
    'CUSTODIAN POSTION',
    'BRAND',
    'Department',
    'Vendor account number',
    'Vendor name',
    'CC',
    'CC Description/Location',
    'Main Location Code',
    'Main Location',
    'LOCATION Code',
    'LOCATION',
    'Sublocation Code',
    'Sublocation Name',
    'SERIAL',
    'Batch No.',
    'DescriptionEnglish',
    'ASSET DESC.',
    ' price per PCs ',
    'CATEGORY',
    'CATEGORY Name',
    'SUB CAT.',
    'SERVICE DATE',
    'SALVAGE YEAR',
    'Quantity',
    'Electronic Serial Number',
    'Company Name'
  ];

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.showLoadingOverlay();
  }

  // Method to handle file upload and parse Excel
  onFileChange(event: any) {
    this.rowData = [];
    this.columnDefs = [];
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      this.toast.show('Cannot use multiple files', 'error');
      return;
    }

    const file = target.files[0];
    const fileType = file.name.split('.').pop()?.toLowerCase();

    // Validate file type
    if (fileType !== 'xlsx' && fileType !== 'csv') {
      this.toast.show('Only Excel (.xlsx) or CSV files are allowed!', 'error');

      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryData = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

      // Assuming data is in the first sheet
      const sheetName: string = workbook.SheetNames[0];
      const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];
      // Parse data into JSON
      const jsonData: any = XLSX.utils.sheet_to_json(sheetData);
      console.log('jsonData', jsonData);

      if (jsonData.length === 0) {
        this.toast.show('Sheet is Empty!', 'error');

        return;
      }

      jsonData.forEach((row: any) => {
        if (row['SERVICE DATE']) {
          row['SERVICE DATE'] = this.parseExcelDate(row['SERVICE DATE']);
        }
      });

      this.rowData = jsonData;

      // Extract and store headers for validation
      this.headers = Object.keys(jsonData[0]);

      // Dynamically set column definitions
      this.columnDefs = this.headers.map((key) => ({
        field: key,
      }));
    };
    reader.readAsBinaryString(file);
  }

  // Check if the file has the correct format
  isValidFormat(): boolean {
    //   const normalizedHeaders = this.headers.map((header) => header.toLowerCase());
    // const normalizedRequiredHeaders = this.requiredHeaders.map((header) => header.toLowerCase());

    // return normalizedRequiredHeaders.every((header) => normalizedHeaders.includes(header));

    return this.requiredHeaders.every((header) =>
      this.headers.includes(header)
    );
  }

  // Transform data into desired payload format
  transformData(data: any[]): any[] {
    return data.map((row) => ({
      custodianName: row['CUSTODIAN NAME'],
      custodianCode: row['CUSTODIAN CODE'],
      custodianPosition: row['CUSTODIAN POSTION'],
      brand: row['BRAND'],
      department: row['Department'],
      vendorAccountNumber: row['Vendor account number'],
      vendorName: row['Vendor name'],
      cc: row['CC'],
      ccDescriptionLocation: row['CC Description/Location'],
      mainLocationCode: row['Main Location Code'],
      mainLocation: row['Main Location'],
      locationCode: row['LOCATION Code'],
      location: row['LOCATION'],
      sublocationCode: row['Sublocation Code'],
      sublocationName: row['Sublocation Name'],
      serial: row['SERIAL'],
      batchNo: row['Batch No.'],
      descriptionEnglish: row['DescriptionEnglish'],
      astDesc: row['ASSET DESC.'],
      pricePerPCs: row[' price per PCs '],
      category: row['CATEGORY'],
      categoryName: row['CATEGORY Name'],
      subCategory: row['SUB CAT.'],
      serviceDate: row['SERVICE DATE'],
      salvageYear: row['SALVAGE YEAR'],
      quantity: row['Quantity'],
      electronicSerialNumber: row['Electronic Serial Number'],
      companyName: row['Company Name'],
    }));
  }

  parseExcelDate(excelDate: any): string {
    console.log('excelDate',excelDate);
    if (!isNaN(excelDate)) {
      const date = new Date(Math.round((excelDate - 25569) * 864e5));
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      console.log(`${day}/${month}/${year}`,'`${day}/${month}/${year}`');
      return `${day}/${month}/${year}`;
    }
    return excelDate;
  }

  // Method to send data to API
  onImport() {
    if (!this.isValidFormat()) {
      this.toast.show(
        'The uploaded file is not in the correct format. Please check the columns.',
        'error'
      );
      return;
    }

    const transformedData = this.transformData(this.rowData);
    const payload = { importData: transformedData };

    console.log('payload', payload);
    this.sendingRequest = true;
    this.tableDataService
      .getTableData('ImportData/ImportData', payload)
      .pipe(
        first(),
        finalize(() => (this.sendingRequest = false))
      )
      .subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.rowData = [];
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  // Download sample template file
  downloadTemplate() {
    const sampleData = [this.requiredHeaders];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sampleData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    // Generate file and trigger download
    XLSX.writeFile(wb, 'Sample_Template.xlsx');
  }
}
