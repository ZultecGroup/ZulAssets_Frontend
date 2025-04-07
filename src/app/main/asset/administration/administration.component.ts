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
import { debug } from 'console';
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
  imagesToPrint: string[] = []; // Initialize the array to hold image URLs

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
  const logo = new Image();
            
  logo.src = 'data:image/png;base64,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'
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
        this.imagesToPrint = [];

        let zplCode = '';

        // Loop through rows and replace placeholders
        rows.forEach((row: any) => {

          debugger
          if (isAssetBarcodeLabel) {
            
            zplCode += this.replacePlaceholders(zplTemplate, row);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
           
            const scale = 3;
            const displayWidth = 200;
            const displayHeight = 100;
            const width = displayWidth * scale; // 600
            const height = displayHeight * scale; // 300
            
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            
            // Scale drawing context for sharp rendering
            ctx.scale(scale, scale);
            
              // White Background (Optional)
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(logo, 0, 5, 20, 10);
          
              // English Text (Top-Left)
              ctx.fillStyle = 'black';
              ctx.font = 'bold 12px Tahoma';
              ctx.textAlign = 'left';
              ctx.fillText('BAJA FOOD INDUSTRIES', 22, 20);
            
              function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number): number {
                const words = text.split(' ');
                let line = '';
                const lineHeight = 10; // Set a line height for wrapping
                const wrappedTextHeight = y; // To track the height after wrapping
            
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const testWidth = ctx.measureText(testLine).width;
            
                    if (testWidth > maxWidth) {
                        ctx.fillText(line, x, y);
                        line = words[i] + ' ';
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, y); // Draw the final line
                return y+4; // Return the final y position after wrapping
            }
            let textHeight = 35; // Initial position for the text

              // English or Arabic alignment
              if (isArabic(row.assetDescription)) {
                  ctx.textAlign = 'right';
                  ctx.direction = 'rtl';
                  textHeight = wrapText(ctx,row.assetDescription, 150, 35, 180); // Right-aligned for Arabic
              } else {
                  ctx.textAlign = 'left';
                  ctx.direction = 'ltr';
                  textHeight =  wrapText(ctx,row.assetDescription, 15, 35, 180); // Left-aligned for English
              }
          
              // Generate Barcode on a separate canvas (No padding)
              const barcodeCanvas = document.createElement('canvas');
              JsBarcode(barcodeCanvas, row.barCode, {
                  format: 'CODE128',
                  width: 2,
                  height: 40,
                  displayValue: false,
                  margin: 0, // Remove padding around barcode
              });
          
              // Draw Barcode (Starts from exact left)
              ctx.drawImage(barcodeCanvas, 20, textHeight);
          
              // Barcode Number (Just below barcode)
              ctx.font = 'bold 12px Tahoma';
              ctx.textAlign = 'center';
              ctx.fillText(row.barCode, 90, textHeight+50);
          
              // Convert to Image and Print
              const finalImageUrl = canvas.toDataURL();
              
              this.imagesToPrint.push(finalImageUrl);

              // this.printImage(finalImageUrl);
         //  }, 100); // 100ms delay to allow the image to load (adjust if needed)


          } else if (isLocationBarcodeLabel) {
            zplCode += this.replacePlaceholdersLoc(zplTemplate, row);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
           
            const scale = 3;
            const displayWidth = 200;
            const displayHeight = 100;
            const width = displayWidth * scale; // 600
            const height = displayHeight * scale; // 300
            
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            
            // Scale drawing context for sharp rendering
            ctx.scale(scale, scale);
            
              // White Background (Optional)
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(logo, 0, 5, 20, 10);
          
              // English Text (Top-Left)
              ctx.fillStyle = 'black';
              ctx.font = 'bold 12px Tahoma';
              ctx.textAlign = 'left';
              ctx.fillText('BAJA FOOD INDUSTRIES', 22, 20);
            
              function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number): number {
                const words = text.split(' ');
                let line = '';
                const lineHeight = 10; // Set a line height for wrapping
                const wrappedTextHeight = y; // To track the height after wrapping
            
                for (let i = 0; i < words.length; i++) {
                    const testLine = line + words[i] + ' ';
                    const testWidth = ctx.measureText(testLine).width;
            
                    if (testWidth > maxWidth) {
                        ctx.fillText(line, x, y);
                        line = words[i] + ' ';
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, y); // Draw the final line
                return y+4; // Return the final y position after wrapping
            }
            let textHeight = 35; // Initial position for the text

              // English or Arabic alignment
              if (isArabic(row.locationFullPath)) {
                  ctx.textAlign = 'right';
                  ctx.direction = 'rtl';
                  textHeight = wrapText(ctx,row.locationFullPath, 150, 35, 180); // Right-aligned for Arabic
              } else {
                  ctx.textAlign = 'left';
                  ctx.direction = 'ltr';
                  textHeight =  wrapText(ctx,row.locationFullPath, 15, 35, 180); // Left-aligned for English
              }
          
              // Generate Barcode on a separate canvas (No padding)
              const barcodeCanvas = document.createElement('canvas');
              JsBarcode(barcodeCanvas, row.compCode, {
                  format: 'CODE128',
                  width: 1,

                  height: 40,
                  displayValue: false,
                  margin: 0, // Remove padding around barcode
              });
          
              // Draw Barcode (Starts from exact left)
              ctx.drawImage(barcodeCanvas, 0, textHeight);
          
              // Barcode Number (Just below barcode)
              ctx.font = 'bold 12px Tahoma';
              ctx.textAlign = 'center';
              ctx.fillText(row.compCode, 90, textHeight+50);
          
              // Convert to Image and Print
              const finalImageUrl = canvas.toDataURL();
              
              this.imagesToPrint.push(finalImageUrl);
          }
        

        });
        
        this.printAllImages();
        console.log('Generated ZPL Code:', zplCode);
    //    this.printZPL(zplCode);
      }
    })
    .catch((error) => {
      console.error('Error with confirmation dialog:', error);
    });
    
}
async printAllImages() {
  const printWindow = window.open('', '_blank');
  
  // Wait until the window is fully loaded before proceeding
  if (printWindow) {
    // Add each image to the document
    for (let i = 0; i < this.imagesToPrint.length; i++) {
      const img = `
        <img src="${this.imagesToPrint[i]}" 
             style="margin-bottom: 20px; width: 2in; height: 1in; object-fit: contain;" />
      `;
      printWindow.document.write(img);
    }

    // Close the document to finish writing and then print
    printWindow.document.close();
    
    // Trigger the print dialog for the entire document
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();  // Optionally close the window after printing
    };
  }
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

//shahroz
// Function to generate ZPL code based on the fetched template
// private generateZPL(zplTemplate: string, labelName: string, isAssetBarcodeLabel: boolean, isLocationBarcodeLabel: boolean): void {
//   const rows = isAssetBarcodeLabel ? this.gridApi.getSelectedRows() : this.locNode;
// console.log('rows',rows);
//   // Ensure that rows exist for generation
//   if (rows.length === 0) {
//     this.toast.show('No rows available to generate ZPL!', 'error');
//     return;
//   }

//   // Confirm print action before proceeding
//   this.confirmationDialogService
//     .customDialog(`Are you sure you want to print ${rows.length} label(s)?`)
//     .then((confirmed) => {
//       if (confirmed) {
//         let zplCode = '';

//         // Loop through rows and replace placeholders
//         rows.forEach((row: any) => {
//           if (isAssetBarcodeLabel) {
//             zplCode += this.replacePlaceholders(zplTemplate, row);
//           } else if (isLocationBarcodeLabel) {
//             zplCode += this.replacePlaceholdersLoc(zplTemplate, row);
//           }
//         });

//         console.log('Generated ZPL Code:', zplCode);
//         this.printZPL(zplCode);
//       }
//     })
//     .catch((error) => {
//       console.error('Error with confirmation dialog:', error);
//     });
// }

// // Function to replace placeholders with asset data in the ZPL template
// private replacePlaceholders(template: string, row: any): string {
//   return template
//     .replace('#Barcode', row.barCode || 'N/A')
//     .replace('#Ref', row['asset#'] || 'N/A')
//     .replace('#ItemDesc', row.assetDescription || 'No Description')
//     // .replace('#Size', row.Size || 'N/A')
//     // .replace('#RegularPrice', row.RegularPrice || '0')
//     // .replace('#QR', row.QR || 'No QR Code');
// }

// // Function to replace placeholders with location data in the ZPL template
// private replacePlaceholdersLoc(template: string, data: any): string {
//   return template
//     .replace('#location', data.locationFullPath || 'No Description')
//     .replace('#locCompCode', data.compCode || 'No Description')
// }

// // Function to handle ZPL printing
// private printZPL(zplCode: string): void {
//   const printWindow: any = window.open();
//   printWindow.document.open('text/plain');
//   printWindow.document.write(zplCode);
//   printWindow.document.close();
//   printWindow.focus();
//   printWindow.print();
//   printWindow.close();
// }
//shahroz
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
  const utf8BOM = '\uFEFF'; // UTF-8 Byte Order Mark to ensure proper encoding
  const blob = new Blob([utf8BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}
