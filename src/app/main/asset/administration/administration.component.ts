import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { first, finalize, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/service/confirmation-dialog.service';
import { TableDataService } from '../../shared/service/table-data.service';
import { toastService } from '../../shared/toaster/toast.service';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { CustodiansDtoResponse } from '../../shared/dtos/Custodians/CustodiansDto';
import { AdministrationDtoResponse } from '../../shared/dtos/Administration/AdministrationDto';
import {  ColDef, GridApi, GridReadyEvent, ModuleRegistry, RowDragEvent,  RowDropZoneParams,  } from 'ag-grid-community';
import { GridType } from '../../shared/dtos/GridType/GridType';
import { GridDataService } from '../../shared/service/grid-data.service';
import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { GeneralService } from '../../shared/service/general.service';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
const JsBarcode = require('jsbarcode');

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdministrationComponent implements OnInit {
  locationupdate: boolean = true;
  categoriesupdate: boolean = true;
  gridData: any[] = [];
  gridView: any[] = [];
  fetchingData: boolean = false;
  sendingRequest: boolean = false;
  search = new FormControl('');
  searchText: string = '';
  searchSubject = new Subject<string>();
  currentDate = new Date();
  CustodianData: any[] = [];
  CustodianView: any[] = [];
  itemData: any[] = [];
  itemView: any[] = [];
  public scale = 0.8;
  selectedTab: number = 0;
  selectedId: any;

  administrationGridCols: ColDef[] = [];

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
  private gridApi!: GridApi;

  private gridDataService = inject(GridDataService);
  gridColumnApi: any;
  payload: any = {};
  subLocationCheckBox: boolean = false;
  node: any;
  administrationAssetItemGridCols: ColDef<any>[];
  zplCode: any;
  zplTemplate: any;
  locNode: any;
  rowData: any =[];
  gridApi2: GridApi<any>;
  gridColumnApi2: any;
  faFileExcel = faFileExcel

  constructor(
    private tableDataService: TableDataService,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    public generalService: GeneralService
  ) {
    this.administrationGridCols = this.gridDataService.getColumnDefs(
      GridType.Administration,
      this.generalService.permissions.Administrator
    );
    this.administrationAssetItemGridCols = this.gridDataService.getColumnDefs(
      GridType.AssetItemsAdmin,
      this.generalService.permissions.Administrator

    );
  }

  ngOnInit(): void {
    // this.getAllAssetsAdministrator(this.pagination.currentPage, this.pagination.pageSize);
    this.GetCustodian();
    this.searchHandler();
  }

  private searchHandler() {
    this.searchSubject
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((term) => {
        this.searchText = term;
        this.getAllAssetsAdministrator(1, this.pagination.pageSize);
      });
  }

  getData(tab: any, node: any) {
    this.node = node;
    console.log('node', node);
    if (tab == 'loc') {
      this.locNode = [node];
      this.payload = null;

      if (this.subLocationCheckBox) {
        this.payload = {
          // locID: node.locID
          searching: 1,
          var: node.locDesc,
        };
      } else {
        this.payload = {
          locID: node.locID,
        };
      }
    } else if (tab == 'cat') {
      this.payload = null;
      this.payload = {
        astCatID: node.astCatID,
      };
    } else if (tab == 'cus') {
      this.payload = null;
      this.selectedId = node.custodianID;
      this.payload = {
        custodianID: node.custodianID,
      };
    } else {
      this.payload = {};
    }
    this.getAllAssetsAdministrator(
      this.pagination.currentPage,
      this.pagination.pageSize
    );
  }

  onCheckboxChange() {
    this.getData('loc', this.node);
  }

  ngAfterViewInit() {}

  public onTabSelect(e: SelectEvent): void {

    this.locNode = [];
    this.selectedTab = e.index;
    this.pagination = {
      currentPage: 1,
      pageSize: 15,
      totalItems: 0,
      pageSizes: [15, 30, 50, 100, 200, 500],
    };
    this.gridData = [];
    this.itemView = [];
    this.rowData = [];
    if (this.selectedTab == 1) {
      this.administrationGridCols[0].dndSource = false;
      this.administrationGridCols[0].width = 5;
      this.gridApi.setColumnDefs(this.administrationGridCols);
    } else {
      this.administrationGridCols[0].dndSource = true;
      this.administrationGridCols[0].width = 65;
      this.gridApi.setColumnDefs(this.administrationGridCols);
    }
  }

  exportToCSV(){
    this.getAllAssetsAdministrator(1,this.pagination.totalItems, true)
  }

  getAllAssetsAdministrator(currentPage: number, pageSize: number, excelExport?: boolean) {
    this.fetchingData = true;

    let pagePayload: any = {
      get: 1,
      paginationParam: {
        pageIndex: currentPage,
        pageSize: pageSize,
      },
    };
    let finalPayLoad: any = {};
    if (this.searchText !== '') {
      finalPayLoad = {
        ...pagePayload,
        searching: 1,
        ...this.payload,
        var: this.searchText,
      };
    } else {
      finalPayLoad = {
        ...pagePayload,
        ...this.payload,
      };
    }
    if (this.selectedTab == 2) {
      this.tableDataService
        .getTableDataWithPagination(
          'Assets/GetAssetItemsAgainstCatID',
          finalPayLoad
        )
        .pipe(
          first(),
          finalize(() => (this.fetchingData = false))
        )
        .subscribe({
          next: (res: any) => {
            if(excelExport){
              console.log('dasdsa hhh');

              if (!res.data || res.data.length === 0) {
                console.warn('No data available for export.');
                this.toast.show('No data available for export.', 'error')
                return;
              }
              console.log('dasdsa');
              // Step 2: Get Visible Columns from AG Grid
              const visibleColumnKeys = this.gridColumnApi2.getAllGridColumns() // Get all columns
              .filter((col: any, index: number) => col.isVisible() && index !== 0) // Filter only visible ones
              .map((col: any) => col.getColId()); // Get column keys

              console.log('Visible Columns:', visibleColumnKeys); // Debugging

              // Step 3: Filter API Data to Match Visible Columns
              const filteredData = res.data.map((row: any) =>
                Object.fromEntries(
                  visibleColumnKeys.map((key: any) => [key, row[key]]) // Keep only visible columns
                )
              );

              console.log('Filtered Data:', filteredData); // Debugging

              // Step 4: Convert Data to CSV Format
              const csvContent = this.convertToCSV(filteredData);

              // Step 5: Download the CSV File
              this.downloadCSV(csvContent, 'assets_administration.csv');
            }else{
            this.gridData = res.data.reverse();
            this.itemView = this.gridData.reverse();
            this.pagination.currentPage = currentPage;
            this.pagination.pageSize = pageSize;
            this.pagination.totalItems = res.totalRowsCount;}
          },
          error: (err) =>
            this.toast.show(err ?? 'Something went wrong!', 'error'),
        });
    } else {
      this.tableDataService
        .getTableDataWithPagination(
          'Assets/GetAllAssetsAdministrator',
          finalPayLoad
        )
        .pipe(
          first(),
          finalize(() => (this.fetchingData = false))
        )
        .subscribe({
          next: (res: AdministrationDtoResponse) => {
            if(excelExport){
              console.log('dasdsa hhh');

              if (!res.data || res.data.length === 0) {
                console.warn('No data available for export.');
                this.toast.show('No data available for export.', 'error')
                return;
              }
              console.log('dasdsa');
              // Step 2: Get Visible Columns from AG Grid
              const visibleColumnKeys = this.gridColumnApi.getAllGridColumns() // Get all columns
                .filter((col: any, index: number) => col.isVisible() && index !== 0) // Filter only visible ones
                .map((col: any) => col.getColId()); // Get column keys

              console.log('Visible Columns:', visibleColumnKeys); // Debugging

              // Step 3: Filter API Data to Match Visible Columns
              const filteredData = res.data.map((row: any) =>
                Object.fromEntries(
                  visibleColumnKeys.map((key: any) => [key, row[key]]) // Keep only visible columns
                )
              );

              console.log('Filtered Data:', filteredData); // Debugging

              // Step 4: Convert Data to CSV Format
              const csvContent = this.convertToCSV(filteredData);

              // Step 5: Download the CSV File
              this.downloadCSV(csvContent, 'assets_administration.csv');
            }else{
            this.gridData = res.data.reverse();
            this.itemView = this.gridData.reverse();
            this.pagination.currentPage = currentPage;
            this.pagination.pageSize = pageSize;
            this.pagination.totalItems = res.totalRowsCount[0].totalRowsCount;
          }
          },
          error: (err) =>
            this.toast.show(err ?? 'Something went wrong!', 'error'),
        });
    }
  }

  GetCustodian() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Custodians/GetAllCustodians', {
        get: 1,
        dropDown: 1,
        var: this.searchText,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CustodiansDtoResponse) => {
          if (res && res.data.length > 0) {
            this.CustodianData = res.data.reverse();
            this.CustodianView = this.CustodianData.reverse();
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onGridReadyItem(params: GridReadyEvent) {
    this.gridApi2 = params.api;
    this.gridColumnApi2 = params.columnApi;
  }

  onFilterTextBoxChanged() {
    this.searchSubject.next(this.searchText);
    // this.gridApi?.setQuickFilter((event.target as HTMLInputElement).value);
  }

  public pageChange(event: number): void {
    this.pagination.currentPage = event;
    this.getAllAssetsAdministrator(
      this.pagination.currentPage,
      this.pagination.pageSize
    );
  }

  pageSizeChange(event: number) {
    this.resetPaginator();
    this.pagination.pageSize = event;
    this.getAllAssetsAdministrator(
      this.pagination.currentPage,
      this.pagination.pageSize
    );
  }

  private resetPaginator() {
    this.pagination.currentPage = 1;
    this.pagination.totalItems = 0;
  }

  onDragOver(event: DragEvent) {
    // console.log('onDragOver loc', event);
    event.preventDefault(); // Enables the drop event
  }

  // Handle the drop event
  onDropEventCustodian(event: DragEvent, targetNode: any) {
    event.preventDefault(); // Prevent browser default handling
    const droppedData = JSON.parse(event.dataTransfer?.getData('text/plain') || '{}');
    const astID = droppedData.astID;
    const selectedRows = this.gridApi.getSelectedRows();
    const payload: any = [];

    selectedRows.map((x: any) =>
      {

        payload.push({
          astID: x.astID,
          fromCustodian: x.custodianID,
          toCustodian: targetNode.custodianID,
          });

      });
    this.confirmationDialogService
    .customDialog(`Are you sure you want to change the Custodian ?`)
    .then((confirmed) => {
      if (confirmed) {
        this.sendingRequest = true

        this.tableDataService.getTableData('Assets/Location_Custody_Transfer',
          {add: 1, locationCheckbox: 0, assetStatusCheckbox: 0, custodianCheckbox: 1, custTransferTree: payload})
        .pipe(finalize(() => this.sendingRequest = false))
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success');
                this.getAllAssetsAdministrator(
                  this.pagination.currentPage,
                  this.pagination.pageSize
                );
              } else {
                this.toast.show(res.message, 'error')
              }
            },
            error: (err) => {
              this.toast.show(err.title, 'error')
            }
          })
      }
    })
  }

  // Handle the drop event
  onDropEventLoc(DragDrop: any) {
    console.log('DragDrop', DragDrop);
    const astID = DragDrop.dropData.astID;
    const selectedRows = this.gridApi.getSelectedRows();
    const payload: any = [];

    selectedRows.map((x: any) =>
      {

        payload.push({
            astID: x.astID,
            fr_Loc: x.locID,
            to_Loc: DragDrop.targetData.locID,
            assetStatus: x.status,
          });

      });

    this.confirmationDialogService
    .customDialog(`Are you sure you want to change the ${DragDrop.page} ?`)
    .then((confirmed) => {
      if (confirmed) {
        this.sendingRequest = true

        this.tableDataService.getTableData('Assets/Location_Custody_Transfer',
          {add: 1, locationCheckbox: 1, assetStatusCheckbox: 0, custodianCheckbox: 0, locTransferTree: payload})
        .pipe(finalize(() => this.sendingRequest = false))
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success');
                this.getAllAssetsAdministrator(
                  this.pagination.currentPage,
                  this.pagination.pageSize
                );
              } else {
                this.toast.show(res.message, 'error')
              }
            },
            error: (err) => {
              this.toast.show(err.title, 'error')
            }
          })
      }
    })
  }

  onDropEventItem(DragDrop: any) {
    console.log('DragDrop', DragDrop);
    const itemCode = DragDrop.dropData.itemCode;
    const selectedRows = this.gridApi2.getSelectedRows();
    const payload: any = [];

    selectedRows.map((x: any) =>
      {

        payload.push({
           itemCode: x.itemCode,
      newCatID: DragDrop.targetData.astCatID
          });

      });

    this.confirmationDialogService
    .customDialog(`Are you sure you want to change the ${DragDrop.page} ?`)
    .then((confirmed) => {
      if (confirmed) {
        this.sendingRequest = true

        this.tableDataService.getTableData('Assets/ItemCategoryTransfer',
          {itemCategoryTransferTrees: payload})
        .pipe(finalize(() => this.sendingRequest = false))
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success');
                this.getAllAssetsAdministrator(
                  this.pagination.currentPage,
                  this.pagination.pageSize
                );
              } else {
                this.toast.show(res.message, 'error')
              }
            },
            error: (err) => {
              this.toast.show(err.title, 'error')
            }
          })
      }
    })
  }

  // ZPL
 // Main function to fetch the ZPL template and initiate printing
 getZplCodeApi(labelName: string): void {
  const isAssetBarcodeLabel = labelName === 'Asset Barcode';
  const isLocationBarcodeLabel = labelName === 'Location Barcode';
  const selectedRows = isAssetBarcodeLabel ? this.gridApi.getSelectedRows() : this.locNode;

  if (selectedRows.length === 0) {
    this.toast.show('Please select a row!', 'error');
    return;
  }



  // Determine the appropriate label to print based on selection
  if (isAssetBarcodeLabel || isLocationBarcodeLabel) {
    this.fetchZPLTemplate(labelName, isAssetBarcodeLabel, isLocationBarcodeLabel);
  } else {
    this.toast.show('Invalid label name!', 'error');
  }
}

// Function to fetch ZPL template from API and generate ZPL
private fetchZPLTemplate(labelName: string, isAssetBarcodeLabel: boolean, isLocationBarcodeLabel: boolean): void {
  this.fetchingData = true;
  this.tableDataService
    .getTableData('Labels/GetLabelDesignForPrinting', { labelName })
    .pipe(
      first(),
      finalize(() => (this.fetchingData = false))
    )
    .subscribe({
      next: (res: any) => {
        this.zplTemplate = res[0]?.labelDesign;
        if (!this.zplTemplate) {
          this.toast.show('Error: No ZPL template found!', 'error');
          return;
        }

        console.log('Fetched ZPL Template:', this.zplTemplate);
        this.generateZPL(this.zplTemplate, labelName, isAssetBarcodeLabel, isLocationBarcodeLabel);
      },
      error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
    });
}

// Function to generate ZPL code based on the fetched template
private generateZPL(zplTemplate: string, labelName: string, isAssetBarcodeLabel: boolean, isLocationBarcodeLabel: boolean): void {
  const rows = isAssetBarcodeLabel ? this.gridApi.getSelectedRows() : this.locNode;
console.log('rows',rows);
  // Ensure that rows exist for generation
  if (rows.length === 0) {
    this.toast.show('No rows available to generate ZPL!', 'error');
    return;
  }
  function isArabic(text: string): boolean {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text);
  }
  // Confirm print action before proceeding
  this.confirmationDialogService
    .customDialog(`Are you sure you want to print ${rows.length} label(s)?`)
    .then((confirmed) => {
      if (confirmed) {
        let zplCode = '';

        // Loop through rows and replace placeholders
        rows.forEach((row: any) => {
          if (isAssetBarcodeLabel) {
            zplCode += this.replacePlaceholders(zplTemplate, row);
            debugger
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
          
            // Exact Label Size (2x1 inches → 200x100 pixels)
            canvas.width = 200;
            canvas.height = 100;
          
            // White Background (Optional)
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          
            // English Text (Top-Left)
            ctx.fillStyle = 'black';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('BAJA FOOD INDUSTRIES', 0, 15);
          
            // English or Arabic alignment
          if (isArabic(row.assetDescription)) {
            ctx.textAlign = 'right';
            ctx.direction = 'rtl';
            ctx.fillText(row.assetDescription, 195, 35); // Right-aligned for Arabic
          } else {
            ctx.textAlign = 'left';
            ctx.direction = 'ltr';
            ctx.fillText(row.assetDescription, 5, 35); // Left-aligned for English
          }
          
            // Generate Barcode on a separate canvas (No padding)
            const barcodeCanvas = document.createElement('canvas');
            JsBarcode(barcodeCanvas, '019269', {
              format: 'CODE128',
              width: 2,
              height: 40,
              displayValue: false,
              margin: 0, // Remove padding around barcode
            });
          
            // Draw Barcode (Starts from exact left)
            ctx.drawImage(barcodeCanvas, 20, 40);
          
            // Barcode Number (Just below barcode)
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(row.barCode, 30, 95);
          
            // Convert to Image and Print
            const finalImageUrl = canvas.toDataURL();
            this.printImage(finalImageUrl);



          } else if (isLocationBarcodeLabel) {
            zplCode += this.replacePlaceholdersLoc(zplTemplate, row);
           
          }
        });

        console.log('Generated ZPL Code:', zplCode);
    //    this.printZPL(zplCode);
      }
    })
    .catch((error) => {
      console.error('Error with confirmation dialog:', error);
    });
}

overlayArabicText(imageUrl: string, row: any) {
 
  const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d')!;
const img = new Image();

img.onload = () => {
  // Set canvas size to exactly 2x1 inches (406x203 pixels)
  canvas.width = 1200;
  canvas.height = 600;
  
  ctx.fillStyle = 'white'; // White background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw barcode image at the correct position
  ctx.drawImage(img, 0, 10); // Adjust position & size

  // Add Arabic text above barcode
  ctx.font = '20px Tahoma'; // Small font for 2x1 inches
  ctx.direction = 'rtl';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
    ctx.fillText(row.assetDescription ,150, 200); // Adjust position

 // Convert to final image and print
 const finalImageUrl = canvas.toDataURL();
 this.printImage(finalImageUrl);
};

// Load barcode image
img.src = imageUrl;
}
  printImage(imageUrl: string) {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`<img src="${imageUrl}" onload="window.print();window.close();"/>`);
    printWindow?.document.close();
  }

// Function to replace placeholders with asset data in the ZPL template
private replacePlaceholders(template: string, row: any): string {
  return template
    .replace('#Barcode', row.barCode || 'N/A')
    .replace('#Ref', row['asset#'] || 'N/A')
   // .replace('#ItemDesc', row.assetDescription || 'No Description')
    // .replace('#Size', row.Size || 'N/A')
    // .replace('#RegularPrice', row.RegularPrice || '0')
    // .replace('#QR', row.QR || 'No QR Code');
}

// Function to replace placeholders with location data in the ZPL template
private replacePlaceholdersLoc(template: string, data: any): string {
  return template
    .replace('#location', data.locationFullPath || 'No Description')
    .replace('#locCompCode', data.compCode || 'No Description')
}

// Function to handle ZPL printing
private printZPL(zplCode: string): void {
  const printWindow: any = window.open();
  printWindow.document.open('text/plain');
  printWindow.document.write(zplCode);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

assetDoubleClick(event: any){
  console.log('double click',event.data.astID);
  if(event.data.astID){

      window.open('#/main/asset/details-maintenance?astID='+ event.data.astID);
    }else{
      this.toast.show('Double Click the Asset ID', 'warning')
    }
}

itemDoubleClick(event: any){
  // http://localhost:4200/#/main/master-data/asset-items/edit/703
  if(event.data.itemCode){

    window.open('#/main/master-data/asset-items/edit/'+ event.data.itemCode);
  }else{
    this.toast.show('Double Click the Item Code', 'warning')
  }
}

//////lower grid

columnDefs = [
  { headerName: 'Asset Detail', field: 'header', resizable: true, width: 200,
    cellClass: 'ag-header-cell'},
  { headerName: 'Description', field: 'value', resizable: true, flex: 1 },
];

// Define the default column properties
defaultColDef = {
  sortable: false,
  filter: false,
};

transformData(data: any){
  return Object.keys(data).map((key) => ({
    header: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(^\w| \w)/g, (match) => match.toUpperCase()), // Optional: format camelCase headers
    value: data[key] === true || data[key] === false ? (data[key] == true ? 'Yes': 'No') : data[key]  ,
  }));
}

getReadOnlyByAstId(data: any){
  const astID = data.astID
  this.fetchingData = true;
    this.tableDataService
      .getTableData('Assets/GetAstInfoByAstIDLowerAdminGrid', {
        astID
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res && res.data.length > 0) {
            this.rowData = this.transformData(res.data[0]);
            console.log('this.rowData ',this.rowData );
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
}
getReadOnlyByItemId(data: any){
  const itemCode = data.itemCode
  this.fetchingData = true;
    this.tableDataService
      .getTableData('Assets/GetAstInfoByItemCodeLowerAdminGrid', {
        itemCode
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res && res.data.length > 0) {
            this.rowData = this.transformData(res.data[0]);
            console.log('this.rowData ',this.rowData );
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
}

filterCustodians(event: Event) {
  const searchText = (event.target as HTMLInputElement).value.toLowerCase();
console.log('search', searchText);
  this.CustodianView= this.CustodianData.filter(custodian =>
    (custodian.custodianID && custodian.custodianID.toString().toLowerCase().includes(searchText))
    ||
    (custodian.custodianCode && custodian.custodianCode.toLowerCase().includes(searchText))
    ||
    (custodian.custodianName && custodian.custodianName.toLowerCase().includes(searchText))
    ||
    (custodian.custAssetsCount && custodian.custAssetsCount == searchText)
  );
}

// Helper function: Convert JSON data to CSV format
convertToCSV(data: any[]): string {
  if (!data.length) return '';

  const headers = Object.keys(data[0]); // CSV headers
  const csvRows = [headers.join(',')]; // Start with header row

  data.forEach(row => {
    const values = headers.map(header => row[header] ?? ''); // Map data
    csvRows.push(values.join(',')); // Join values with commas
  });

  return csvRows.join('\n'); // Combine all rows
}

// Helper function: Trigger CSV download
downloadCSV(csvContent: string, filename: string) {
  const bom = '\uFEFF'; // UTF-8 BOM
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
