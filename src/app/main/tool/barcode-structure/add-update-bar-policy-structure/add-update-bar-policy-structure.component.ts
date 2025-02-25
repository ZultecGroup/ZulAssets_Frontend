import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { finalize, first, map, take } from 'rxjs';
import { BarCodeStructureDtoResponse } from 'src/app/main/shared/dtos/BarCodeStructure/BarCodeStructureDto';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-add-update-bar-policy-structure',
  templateUrl: './add-update-bar-policy-structure.component.html',
  styleUrls: ['./add-update-bar-policy-structure.component.scss'],
})
export class AddUpdateBarPolicyStructureComponent implements OnInit {
  today = new Date();
  barCodeStructureForm!: FormGroup;
  sendingRequest: boolean = false;
  isEditMode: boolean = false;
  scheduleId!: number;
  fetchingData: boolean = false;
  formData: any;
  dynamicForm: FormGroup;
  public listItems: Array<{ text: string; value: number }> = [
    { text: '0', value: 0 },
    { text: "1", value: 1 },
    { text: "2", value: 2 },
    { text: "3", value: 3 },
    { text: "4", value: 4 },
    { text: "5", value: 5 },
    { text: "6", value: 6 },
  ];

  public seperatorList = [
    {
      text: '-', value: '-'
    },
    {
      text: '_', value: '_'
    }
  ]
  pagination = {
    currentPage: 1,
    pageSize: 15,
    totalItems: 0,
  }
barStructLength: any;
  totalLength: any;
  barStructPrefix: any = '';
barcode: any;
valueSep: any = '';
  gridApi: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dataService: TableDataService,
    private toast: toastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    const queryParams = this.route.snapshot.queryParams;

    this.scheduleId = params[ 'id' ];
    this.pagination.currentPage = Number(queryParams[ 'currentPage' ]) || 1;
    this.pagination.pageSize = Number(queryParams[ 'pageSize' ]) || 15;

    this.isEditMode = !!this.scheduleId;
    this.initializescheduleForm();
     // Initial calculation for selected rows
  this.calculateSelectedLengthSum();
  this.updateSelectedDisplayValues();

    if (this.isEditMode) {
      this.getScheduleById();
    }
  }


  getScheduleById() {
    this.fetchingData = true;
    let paginationParam = {
      pageIndex: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
    }
    this.dataService
      .getTableData('BarcodeStructure/GetAllBarcodeStructures', { get: 1, paginationParam })
      .pipe(
        map((schedulesList: BarCodeStructureDtoResponse) =>
          schedulesList.data.find(
            (schedule: any) => schedule.barStructID == this.scheduleId
          )
        ),
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          this.barCodeStructureForm.patchValue({
            barStructID: this.scheduleId,
            barStructDesc: res?.barStructDesc,
            barStructLength: res?.barStructLength,
            barStructPrefix: res?.barStructPrefix,
            valueSep: res?.valueSep,
            barcode: res?.barCode,
          });
          this.barStructPrefix = res?.barStructPrefix;
          this.valueSep = res?.valueSep;
          this.barcode = res?.barCode;
          this.updateRowData();
        },
      });
  }

  updateRowData() {
    const entries = this.barcode.split(',');

    entries.forEach((entry: any) => {
      const [displayValue, length] = entry.split('-');
      const matchingRow = this.rowData.find(row => row.displayValue === displayValue);

      if (matchingRow) {
        matchingRow.selection = true;
        matchingRow.length = +length; // Convert string to number
      }
    });
    this.gridApi.setRowData(this.rowData);
    console.log(this.rowData); // Updated rowData
  }


  initializescheduleForm() {
    this.barCodeStructureForm = this.fb.group({
      barStructID: ['0'],
      barStructDesc: ['', [Validators.required, noWhitespaceValidator()]],
      barStructLength: [0, Validators.max(20)],
      barStructPrefix: [''],
      valueSep: [''],
      barcode: ['', [Validators.required, noWhitespaceValidator()]],
      loginName: [
        JSON.parse(localStorage.getItem('userObj')!).loginName,
        [Validators.required, noWhitespaceValidator()],
      ],
    });
  }







  onSubmit() {
    if (this.barCodeStructureForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.isEditMode
        ? this.dataService.getTableData(
          'BarcodeStructure/UpdateBarcodeStructure',
          { update: 1, ...this.barCodeStructureForm.value }
        )
        : this.dataService.getTableData(
          'BarcodeStructure/InsertBarcodeStructure',
          { add: 1, ...this.barCodeStructureForm.value }
        );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.router.navigate(['main/tool/barcode-structure']);
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.barCodeStructureForm);
    }
  }

  rowData = [
    { srNo: 1, selection: false, content: 'Asset ID', displayValue: 'AID', length: 0, DefaultLength: 14 },
    { srNo: 2, selection: false, content: 'Asset Number', displayValue: 'ANM', length: 0, DefaultLength: 8 },
    { srNo: 3, selection: false, content: 'Reference #', displayValue: 'REF', length: 0, DefaultLength: 10 },
    { srNo: 4, selection: false, content: 'Category', displayValue: 'CAT1', length: 0, DefaultLength: 4 },
    { srNo: 5, selection: false, content: 'Sub Category', displayValue: 'CAT2', length: 0, DefaultLength: 4 },
    { srNo: 6, selection: false, content: 'Location', displayValue: 'LOC1', length: 0 , DefaultLength: 4},
    { srNo: 7, selection: false, content: 'Sub Location', displayValue: 'LOC2', length: 0, DefaultLength: 4 },
  ];

  columnDefs: ColDef[] = [
    {
      headerName: 'Selection',
      field: 'selection',
      cellRenderer: (params: any) => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = params.value;

        input.addEventListener('change', () => {
          params.setValue(input.checked);
          params.data.selection = input.checked;
          params.api.refreshCells({ rowNodes: [params.node], columns: ['displayValue', 'length'] });
          this.calculateSelectedLengthSum(); // Recalculate sum on checkbox toggle
          this.updateSelectedDisplayValues();
        });

        return input;
      },
      editable: false,
      width: 120
    },
    { headerName: 'Sr #', field: 'srNo', sortable: true, filter: true, width: 80 },
    { headerName: 'Contents', field: 'content', sortable: true, width: 150 },
    {
      headerName: 'Display Value',
      field: 'displayValue',
      valueGetter: (params: any) => {
        return params.data.selection ? `${params.data.displayValue}-${params.data.length}` : '';
      },
      width: 200
    },
    {
      headerName: 'Length',
      field: 'length',
      editable: (params: any) => {return params.data.selection},
      cellEditorSelector: (params: any) => {
        if (params.data.selection) {
          return {
            component: 'agSelectCellEditor',
            params: { values: [0, 1, 2, 3, 4, 5, 6] }
          };
        }
        return undefined;
      },
      onCellValueChanged: (event: any) => {
        const updatedRow = event.data;
        if (updatedRow.selection) {
          // updatedRow.displayValue = `${updatedRow.displayValue}-${updatedRow.length}`;
          event.api.refreshCells({ rowNodes: [event.node], columns: ['displayValue'] });
          this.calculateSelectedLengthSum();
          this.updateSelectedDisplayValues();
        }
      },
      width: 100
    }
  ];

  // Calculate the sum of lengths for selected rows, including word count from the TextBox
  calculateSelectedLengthSum() {
    // Get the word count from the external word input (TextBox)
    let wordCount = 0
    if(this.barStructPrefix != ''){
     wordCount = this.barStructPrefix.length ;
    }
    const selectedRows = this.rowData
    .filter(row => row.selection);
    // Calculate the sum of selected rows' lengths
   const selectedRowsLengthSum = selectedRows // Only selected rows
      .reduce((sum, row) => sum + (row.length == 0 ? row.DefaultLength : row.length), 0); // Sum up the lengths of selected rows

      let seprator = 0
      console.log('this.valueSep',this.valueSep);
      if(this.valueSep != ''){
        seprator = selectedRows.length - 1;
      }
    // Update the total sum: Add word count from the external TextBox to the sum of selected rows' lengths
    this.barStructLength = selectedRowsLengthSum + wordCount + seprator;

  }

   // Handle external word input change
   onWordInputChange() {
    this.calculateSelectedLengthSum(); // Recalculate sum when TextBox changes
    this.updateSelectedDisplayValues();
  }

// Handle dropdown value change
onDropdownChange(event: any) {
  if (event.data.selection) {
    this.calculateSelectedLengthSum();
  }
}




  gridOptions: GridOptions = {
    rowData: this.rowData,
    columnDefs: this.columnDefs,

    defaultColDef: {
      resizable: true,
    },
    onGridReady: (params: any) => {
      this.gridApi = params.api;
      params.api.sizeColumnsToFit();
    },
    rowSelection: 'multiple', // Allows multiple rows to be selected
  };

  onRowSelectionChanged() {
    const selectedRows = this.rowData.filter(row => row.selection);
    const totalLength = selectedRows.reduce((sum: any, row: any) => sum + row.length, 0);
    console.log('Total Length of Selected Rows:', totalLength);
    this.totalLength = totalLength;
  }



  updateSelectedDisplayValues() {
    const selectedRows = this.rowData.filter(row => row.selection); // Get the selected rows
    // Map the selected rows to their display values and join them as a comma-separated string
    this.barcode = selectedRows
      .map(row => row.displayValue +'-'+ row.length)
      .join(','); // Join display values with commas

      if(this.barStructPrefix != ''){
        this.barcode = 'FIX-'+ this.barStructPrefix +','+this.barcode
      }
  }
}
