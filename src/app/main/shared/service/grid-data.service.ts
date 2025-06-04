import { Injectable } from '@angular/core';
import { ColDef, GridApi, ICellRendererParams, ProcessCellForExportParams, ProcessHeaderForExportParams } from 'ag-grid-community';
import { GridType } from '../dtos/GridType/GridType';
import { ActionCellComponent } from '../components/action-cell/action-cell.component';
import { DatePipe } from '@angular/common';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class GridDataService {

  constructor(private datePipe: DatePipe, public generalService: GeneralService) { }

  exportToCSV(gridApi:GridApi, fileName: string): void
  {
    gridApi.exportDataAsCsv({
      fileName: fileName,
      processCellCallback: ({ column, value }: ProcessCellForExportParams) =>
        column.getColId() === 'Actions' || column.getColId() === 'rowNo' ? '' : value,
      processHeaderCallback: ({ column }: ProcessHeaderForExportParams) =>
        column.getColId() === 'Actions' || column.getColId() === '' ? '' : column.getColDef().headerName ?? '',
    });
  }
 // Custom Renderer for Drag Handle
 dragHandleRenderer(params: any): string {
  return `
    <div cdkDragHandle>
      <span style="cursor: grab;">&#x2630;</span>
    </div>
  `;
}
  getColumnDefs(type: GridType, permission: any): ColDef[] {
    switch (type) {
      case GridType.Companies:
        return this.getCompaniesGridCols(permission);

      case GridType.OrganizationLevels:
        return this.getOrganizationLevelGridCols(permission);

      case GridType.BarCodingPolicy:
        return this.getBarCodingPolicyGridCols(permission);

      case GridType.AssetsCodingDefinition:
        return this.getAssetsCodingDefinitionGridCols(permission);

      case GridType.Designation:
        return this.getDesignationsGridCols(permission);

      case GridType.AddressTemplate:
        return this.getAddressTemplateGridCols(permission);

      case GridType.Brands:
        return this.getBrandsGridCols(permission);

      case GridType.Insurers:
        return this.getInsurersGridCols(permission);

      case GridType.Suppliers:
        return this.getSuppliersGridCols(permission);

      case GridType.GLCodes:
        return this.getGLCodesGridCols(permission);

      case GridType.Units:
        return this.getUnitsGridCols(permission);

      case GridType.DisposalMethod:
        return this.getDisposalMethodGridCols(permission);

      case GridType.DepreciationMethod:
        return this.getDepreciationMethodGridCols(permission);

      case GridType.AssetItems:
        return this.getAssetItemsGridCols(permission);

        case GridType.AssetItemsAdmin:
        return this.getAssetItemsAdminGridCols();

      case GridType.AssetBooks:
        return this.getAssetBooksGridCols(permission);

      case GridType.InventorySchedules:
        return this.getInventorySchedulesGridCols(permission);

      case GridType.CostCenters:
        return this.getCostCentersGridCols(permission);

      case GridType.Custodians:
        return this.getCustodiansGridCols(permission);

      case GridType.Users:
        return this.getUsersGridCols(permission);

      case GridType.Roles:
        return this.getRolesGridCols(permission);

      case GridType.CompanyInfo:
        return this.getCompanyInfoGridCols(permission);

      case GridType.DepreciationEngine:
        return this.getDepreciationEngineGridCols();

      case GridType.BarCodeStructure:
        return this.getBarCodeStructureGridCols(permission);

      case GridType.BackendInventory:
        return this.getBackendInventoryGridCols();

      case GridType.DeviceConfig:
        return this.getDeviceConfigGridCols(permission);

      case GridType.Administration:
        return this.getAssetsAdministrationCols();

      case GridType.WarrantyAlarm:
        return this.getWarrantyAlarmCols();

      case GridType.InterCompanyTransfer:
        return this.getInterCompanyTransferCols();

      case GridType.AssetListModal:
        return this.getAssetListModalCols();

      case GridType.LocationCustodyTransfer:
        return this.getLocationCustodyTransferCols(permission);

      // case GridType.DataProcessing:
      //   return this.getDataProcessingCols();

      case GridType.ReportingAudit:
        return this.getReportingAuditCols();

      case GridType.ReportingAuditResult:
        return this.getReportingAuditResultCols();

      case GridType.ApprovedPurchaseOrder:
        return this.getApprovedPurchaseOrderCols();

      case GridType.PurchaseOrder:
        return this.getPurchaseOrderCols();

      case GridType.AssetSearch:
        return this.getAssetSearchCols();

      case GridType.PoPreparation:
        return this.getPoPreparationCols(permission);

      case GridType.PoApprovals:
        return this.getPoApprovalsCols(permission);

      case GridType.AdditionalCostHistory:
        return this.getAdditionalCostHistoryCols();

      case GridType.CustodianHistory:
        return this.getCustodianHistoryCols();

      case GridType.AssetBookList:
        return this.getAssetBookListCols();

      case GridType.AnualExpectedDeprication:
        return this.getAnualExpectedDepricationCols();

      case GridType.MonthlyExpectedDeprication:
        return this.getMonthlyExpectedDepricationCols();

      case GridType.FiscalYearDepreciation:
        return this.getFiscalYearDepreciationCols();

      case GridType.DisposalOrSalesInfo:
        return this.getDisposalOrSalesInfoCols(permission);

      case GridType.ExtendedWarranty:
        return this.getExtendedWarrantyCols(permission);

      case GridType.TrackingHistroy:
        return this.getTrackingHistroyCols();

      case GridType.OrganizationGroups:
        return this.getOrganizationGroupsCols(permission);

      case GridType.DataAcquisition:
        return this.getDataAcquisitionCols();

      case GridType.inventroyDevices:
        return this.getInventroyDevicesCols();

      default:
        return [];
    }
  }

  // reusable action column
  getActionColumn(gridType: GridType, permission: any): ColDef {

    if(permission?.edit || permission?.delete){
    return {
      field: "Actions",
      headerName: "Actions",
      width: 110,
      pinned: 'right',
      filter: false,
      floatingFilter: false,
      sortable: false,
      cellClass: 'd-flex justify-content-center align-items-center',
      cellRenderer: ActionCellComponent,

      cellRendererParams: {
        gridName: gridType,
        permissions: permission,
      }
    }
  }else{
    return {hide: true,};
  }

  }

  getCompaniesGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'companyId', flex: 1, headerName: 'Company ID' },
      { field: 'companyCode', flex: 1, headerName: 'Company Code' },
      { field: 'companyName', flex: 1, headerName: 'Company Name' },
      this.getActionColumn(GridType.Companies, permission)
    ];
  }

  getOrganizationLevelGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'lvlID', flex: 1, headerName: 'Level ID' },
      { field: 'lvlDesc', flex: 1, headerName: 'Level Name' },
      this.getActionColumn(GridType.OrganizationLevels, permission)
    ];
  }

  getBarCodingPolicyGridCols(permission: any): ColDef[] {
    return [
      { field: '', headerName: '', width: 5, checkboxSelection: true },
      { field: 'companyId', flex: 1, headerName: 'Company ID' },
      { field: 'companyCode', flex: 1, headerName: 'Company Code' },
      { field: 'companyName', flex: 1, headerName: 'Company Name' },
      { field: 'barCode', flex: 1, headerName: 'Barcode Structure' },
      this.getActionColumn(GridType.BarCodingPolicy, permission)
    ];
  }

  getAssetsCodingDefinitionGridCols(permission: any): ColDef[] {
    return [
      { field: 'assetCodingID', headerName: '', width: 5, checkboxSelection: true },
      { field: 'companyName', flex: 1, headerName: 'Company Name' },
      { field: 'startSerial', flex: 1, headerName: 'Start Serial' },
      { field: 'endSerial', flex: 1, headerName: 'End Serial' },
      { field: 'status', flex: 1, headerName: 'Status' },
      this.getActionColumn(GridType.AssetsCodingDefinition, permission)
    ];
  }

  getDesignationsGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'designationID', flex: 1, headerName: 'Designation Code' },
      { field: 'description', flex: 1, headerName: 'Description' },
      this.getActionColumn(GridType.Designation, permission)
    ];
  }

  getAddressTemplateGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'addressID', flex: 1, headerName: 'Address Code' },
      { field: 'addressDesc', flex: 1, headerName: 'Address Description' },
      this.getActionColumn(GridType.AddressTemplate, permission)
    ];
  }

  getBrandsGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'astBrandID', flex: 1, headerName: 'Brand Code' },
      { field: 'astBrandName', flex: 1, headerName: 'Brand Name' },
      this.getActionColumn(GridType.Brands, permission)
    ];
  }

  getInsurersGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'insCode', flex: 1, headerName: 'Insurer ID' },
      { field: 'insName', flex: 1, headerName: 'Insurer Name' },
      this.getActionColumn(GridType.Insurers, permission)
    ];
  }

  getSuppliersGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'suppID', headerName: 'Supplier ID' },
      { field: 'suppName', headerName: 'Supplier Name' },
      { field: 'suppCell', headerName: 'Supplier Cell' },
      { field: 'suppFax', headerName: 'Supplier Fax' },
      { field: 'suppPhone', headerName: 'Supplier Phone' },
      { field: 'suppEmail', headerName: 'Supplier Email' },
      this.getActionColumn(GridType.Suppliers, permission)
    ];
  }

  getGLCodesGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'glCode', flex: 1, headerName: 'GL Code' },
      { field: 'companyName', flex: 1, headerName: 'Company' },
      { field: 'glDesc', headerName: 'Description' },
      this.getActionColumn(GridType.GLCodes, permission)
    ];
  }

  getUnitsGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'unitID', flex: 1, headerName: 'Unit ID' },
      { field: 'unitDesc', flex: 1, headerName: 'Unit Description' },
      this.getActionColumn(GridType.Units, permission)
    ];
  }

  getDisposalMethodGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'dispCode', flex: 1, headerName: 'Disposal Method Code' },
      { field: 'dispDesc', flex: 1, headerName: 'Disposal Method Name' },
      this.getActionColumn(GridType.DisposalMethod, permission)
    ];
  }

  getDepreciationMethodGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'depCode', flex: 1, headerName: 'Depreciate Code' },
      { field: 'depDesc', flex: 1, headerName: 'Depreciate Name' },
      this.getActionColumn(GridType.DepreciationMethod, permission)
    ];
  }

  getAssetItemsGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'itemCode', flex: 1, headerName: 'Item Code' },
      { field: 'astDesc', flex: 1, headerName: 'Description' },
      { field: 'catFullPath', flex: 1, headerName: 'Category' },
      { field: 'warranty', flex: 1, headerName: 'Warranty' },
      { field: 'barStructDesc', flex: 1, headerName: 'Barcode' },
      this.getActionColumn(GridType.AssetItems, permission)
    ];
  }
  getAssetItemsAdminGridCols(): ColDef[] {
    return [
      { field: 'rowNo',headerCheckboxSelection: true, headerName: '', width: 65, checkboxSelection: true, dndSource: true },
      { field: 'itemCode', flex: 1, headerName: 'Item Code' },
      { field: 'astDesc', flex: 1, headerName: 'Description' },
      { field: 'astCatDesc', flex: 1, headerName: 'Category' },
      { field: 'warranty', flex: 1, headerName: 'Warranty' },
    ];
  }

  getAssetBooksGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'bookID', flex: 1, headerName: 'Book ID' },
      { field: 'description', flex: 1, headerName: 'Description' },
      { field: 'depCode', flex: 1, headerName: 'Depreciation Method' },
      { field: 'companyID', flex: 1, headerName: 'Company' },
      this.getActionColumn(GridType.AssetBooks, permission)
    ];
  }

  getInventorySchedulesGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'invSchCode', flex: 1, headerName: 'Schedule ID' },
      { field: 'invDesc', flex: 1, headerName: 'Description' },
      {
        field: 'invStartDate', flex: 1, headerName: 'Start Date',
        cellRenderer: (params: ICellRendererParams) => {
          return this.datePipe.transform(params.value, 'MMM d, y');
        }
      },
      {
        field: 'invEndDate', flex: 1, headerName: 'End Date',
        cellRenderer: (params: ICellRendererParams) => {
          return this.datePipe.transform(params.value, 'MMM d, y');
        }
      },
      this.getActionColumn(GridType.InventorySchedules, permission)
    ];
  }

  getCostCentersGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'costID', flex: 1, headerName: 'Cost Number' },
      { field: 'costName', flex: 1, headerName: 'Cost Name' },
      this.getActionColumn(GridType.CostCenters, permission)
    ];
  }

  getCustodiansGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'custodianID', flex: 1, headerName: 'Custodian ID' },
      { field: 'custodianCode', flex: 1, headerName: 'Custodian Code' },
      { field: 'custodianName', flex: 1, headerName: 'Custodian Name' },
      { field: 'designation', flex: 1, headerName: 'Custodian Designation' },
      { field: 'orgHierName', flex: 1, headerName: 'Custodian Department' },
      this.getActionColumn(GridType.Custodians, permission)
    ];
  }

  getUsersGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'loginName', flex: 1, headerName: 'Login Name' },
      { field: 'userName', flex: 1, headerName: 'User Name' },
      { field: 'role', flex: 1, headerName: 'User Role' },
      { field: 'userAccess', flex: 1, headerName: 'User Access' },
      this.getActionColumn(GridType.Users, permission)
    ];
  }

  getRolesGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'roleID', width: 200, headerName: 'Role ID' },
      { field: 'description', flex: 1, headerName: 'Role Description' },
  //     {headerName: 'Companies',
  // field: 'companies',flex: 1,
  // valueFormatter: (params) => {
  //   return params.value.map((c: any) => c.companies).join(', ');
  // }},
      this.getActionColumn(GridType.Roles, permission)
    ];
  }

  getCompanyInfoGridCols(permission: any): ColDef[] {
    return [
      { field: 'id', headerName: '', width: 5, checkboxSelection: true },
      { field: 'name',  headerName: 'Name' },
      { field: 'email',  headerName: 'Email' },
      { field: 'address',  headerName: 'Address' },
      { field: 'city', headerName: 'City' },
      { field: 'country', headerName: 'Country' },
      this.getActionColumn(GridType.CompanyInfo, permission)
    ];
  }

  getDepreciationEngineGridCols(): ColDef[] {
    return [
      { field: 'bookID', headerName: '', width: 5, checkboxSelection: true, headerCheckboxSelection: true },
      { field: 'bookID', flex: 1, headerName: 'Book ID' },
      { field: 'description', flex: 1, headerName: 'Description' },
      { field: 'depDesc', flex: 1, headerName: 'Depreciation Method' },
      { field: 'companyName', width: 200, headerName: 'Company' }
    ];
  }

  getBarCodeStructureGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'barStructID', flex: 1, headerName: 'Structure ID' },
      { field: 'barStructDesc', flex: 1, headerName: 'Description' },
      this.getActionColumn(GridType.BarCodeStructure, permission)
    ];
  }

  getDeviceConfigGridCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'deviceID', width: 80, headerName: 'ID' },
      { field: 'deviceDesc', flex: 1, headerName: 'Description' },
      { field: 'comType', flex: 1, headerName: 'Type', valueFormatter: (params: { value: any }) => {
        const statusMap: { [key: number]: string } = {
          1: 'MS Active Sync',
          2: 'Web Service',
        };
        return statusMap[params.value] || ''; // Default to 'Unknown' if no match
      },
         },
      { field: 'devicePhNo', flex: 1, headerName: 'SIM Card No' },
      { field: 'status', flex: 1, headerName: 'Status', valueFormatter: (params: { value: any }) => {
        const statusMap: { [key: string]: string } = {
          'true': 'Active',
          'false': 'InActive',
        };
        return statusMap[params.value] || ''; // Default to 'Unknown' if no match
      },
         },
      { field: 'hardwareID', flex: 1, headerName: 'Hardware ID' },
      { field: 'progress', flex: 1, headerName: 'Progress' },
      this.getActionColumn(GridType.DeviceConfig, permission)
    ];
  }

  getInventroyDevicesCols(){
    return [
      { field: 'deviceID', headerName: '', width: 5, checkboxSelection: true },
      { field: 'deviceID', width: 80, headerName: 'ID' },
      { field: 'deviceDesc', flex: 1, headerName: 'Description' },
      { field: 'deviceSerialNo', flex: 1, headerName: 'Device Serial No' },

      { field: 'hardwareID', flex: 1, headerName: 'Hardware ID' }
    ];
  }


  getBackendInventoryGridCols(): ColDef[] {
    return [
      { field: 'id', headerName: '', width: 5, checkboxSelection: true },
      { field: 'status', width: 150, headerName: 'Status' },
      { field: 'barcode', width: 150, headerName: 'Barcode' },
      { field: 'assetDescription', width: 200, headerName: 'Asset Description' },
      { field: 'pieces', width: 150, headerName: 'Pieces' },
      { field: 'fromLocation', width: 200, headerName: 'Previous Location' },
      { field: 'toLocation', width: 200, headerName: 'Current Location' },
      { field: 'catFullPath', width: 150, headerName: 'Category' },
    ];
  }

  getAssetsAdministrationCols(): ColDef[] {
    return [
      { field: 'astID', headerCheckboxSelection: true, headerName: '', width: 70, checkboxSelection: true, dndSource: true},
      {minWidth: 70, field: 'asset#', flex: 1, headerName: 'Asset #'},
      {minWidth: 150, field: 'arAssetDescription', flex: 1, headerName: 'Ar. Description',   },
      {minWidth: 150, field: 'assetDescription', flex: 1, headerName: 'Description',   },
      {minWidth: 180, field: 'custodianCode', flex: 1, headerName: 'Custodian Code' },
      {minWidth: 180, field: 'custodianName', flex: 1, headerName: 'Custodian Name' },
      {minWidth: 180, field: 'lastAuditDate', flex: 1, headerName: 'Last Audit Date', cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      }  },
      {minWidth: 150, field: 'currYearCount', flex: 1, headerName: 'Current Year' },
      {minWidth: 150, field: 'lastYearCount', flex: 1, headerName: 'Last Year' },
      {minWidth: 150, field: 'astBrandName', flex: 1, headerName: 'Brand' },
      {minWidth: 190, field: 'companyName', flex: 1, headerName: 'Company' },
      {minWidth: 100, field: 'barCode', flex: 1, headerName: 'BarCode' },
      {minWidth: 110, field: 'serial#', flex: 1, headerName: 'Serial#' },
      {minWidth: 110, field: 'd365', flex: 1, headerName: 'D365' },
      {minWidth: 200, field: 'fullCategory', flex: 1, headerName: 'Full Category' },
      {minWidth: 200, field: 'locationFullPath', flex: 1, headerName: 'Full Location' },
      {minWidth: 80, field: 'costNumber', flex: 1, headerName: 'Cost#' },
      {minWidth: 200, field: 'costName', flex: 1, headerName: 'Cost Name' },
      {minWidth: 70, field: 'warranty', flex: 1, headerName: 'Warranty' },
      {minWidth: 100, field: 'status', flex: 1, headerName: 'Status' },
      {minWidth: 200, field: 'disposalComments', flex: 1, headerName: 'Disposal Comments' },
      {minWidth: 100, field: 'labelCount', flex: 1, headerName: 'Label Count' },
    ];
  }

  getWarrantyAlarmCols(): ColDef[] {
    return [
      { field: 'iconIndex', headerName: '', width: 5, cellRenderer: (params: any) =>
        `<div style="color:red"><i *ngIf="params.value == 1" class="fa-solid fa-circle-xmark"></i></div>` },
      { field: 'assetID', flex: 1, headerName: 'Asset ID' },
      { field: 'assetNumber', flex: 1, headerName: 'Asset Number' },
      { field: 'description', flex: 1, headerName: 'Description' },
      { field: 'refNo', flex: 1, headerName: 'Ref No' },
      { field: 'warrantyStart', flex: 1, headerName: 'Warranty Start',cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'expiryDate', flex: 1, headerName: 'Expiry Date', cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'dismiss', flex: 1, headerName: 'Dismiss',
        cellRenderer: (params: any) => {
        const link = document.createElement('span');
        link.style.textDecoration = 'underline';
        link.style.color = 'blue'; // Optional: style it as a link
        link.style.cursor = 'pointer';
        link.innerText = params.value;
        link.onclick = () => {
          console.log('Clicked:', params.data); // Execute your function here
        };
        return link;
      } }
    ];
  }

  getAssetListModalCols(headerSelection: boolean = true): ColDef[] {
    return [
      { field: 'astID', headerName: '', width: 5, checkboxSelection: true, headerCheckboxSelection: headerSelection },
      { field: 'barCode', headerName: 'Barcode'},
      { field: 'astID', headerName: 'Ast ID' },
      { field: 'asset#', headerName: 'Ast Num'},
      { field: 'assetDescription', headerName: 'Ast Desc'},
      { field: 'serial#', headerName: 'Serial #' },
      { field: 'custodianName', headerName: 'Ast Custodian' },
      { field: 'locationFullPath', headerName: 'Ast Location'},
      { field: 'fullCategory', headerName: 'Ast Category' },
      { field: 'shortBarcode', headerName: 'Short Barcode' },
      { field: 'fullBarcode', headerName: 'Full Barcode' },
    
    ];
  }

  getInterCompanyTransferCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'bookID', headerName: 'Book ID' },
      { field: 'astID', headerName: 'Asset ID' },
      { field: 'depCode', headerName: 'Dep Code' },
      { field: 'salvageValue', headerName: 'Salvage Value',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'salvageYear', headerName: 'Salvage Year' },
      { field: 'lastBV', headerName: 'Last BV',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'currentBV', headerName: 'Current BV',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'bvUpdate', headerName: 'BV Update', cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'description', headerName: 'Description' },
      { field: 'salvageValuePercent', headerName: 'Salve Value Percentage',valueFormatter: (params) => currencyFormatter(params.value) },
    ];
  }

  getLocationCustodyTransferCols(permission: any): ColDef[] {
    return [
      ...this.getAssetListModalCols(false),
      this.getActionColumn(GridType.LocationCustodyTransfer, permission)
    ];
  }

  getDataProcessingCols(auditData: any): ColDef[] {

    if(auditData == 1){
      return [
        { field: '', headerName: '', width: 5, checkboxSelection: true, headerCheckboxSelection: true },
        { field: 'status', flex: 1, headerName: 'Status', valueFormatter: (params: { value: number }) => {
          const statusMap: { [key: number]: string } = {
            1: 'Found',
            2: 'Misplaced',
            3: 'Transferred',
          };
          return statusMap[params.value] || 'Unknown'; // Default to 'Unknown' if no match
        },
           },
        { field: 'astID', flex: 1, headerName: 'ast ID' },
        { field: 'astDesc', flex: 1, headerName: 'Description' },
        { field: 'pieces', flex: 1, headerName: 'Pieces' },
        { field: 'inventoryDate', flex: 1, headerName: 'Inventory Date', cellRenderer: (params: ICellRendererParams) => {
          return this.datePipe.transform(params.value, 'MMM d, y');
        }  },
        { field: '0', flex: 1, headerName: 'Cost Center' },
        { field: 'remarks', flex: 1, headerName: 'Remarks' },
        { field: 'fromLocDesc', flex: 1, headerName: 'Previous Location' },
        { field: 'toLocDesc', flex: 1, headerName: 'Current Location' },
        { field: 'deviceDesc', flex: 1, headerName: 'Device' },
        { field: 'catFullPath', flex: 1, headerName: 'Category' },
      ];
    }else{
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true, headerCheckboxSelection: true },
      { field: 'description', flex: 1, headerName: 'Description' },
      { field: 'astModel', flex: 1, headerName: 'Ast Model' },
      { field: 'serailNo', flex: 1, headerName: 'Serial No' },
      { field: 'hisDate', flex: 1, headerName: 'His Date', cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      }  },
      { field: 'locationFullpath', flex: 1, headerName: 'Location' },
      { field: 'catFullPath', flex: 1, headerName: 'Category' },
      { field: 'deviceDesc', flex: 1, headerName: 'Device Desc' },
    ];
  }
  }

  getReportingAuditCols(): ColDef[] {
    return [
      {  headerCheckboxSelection: true, width: 5, checkboxSelection: true },
      { field: 'invSchCode', width: 100, headerName: 'Code' },
      { field: 'invDesc', flex: 1, headerName: 'Description' },
      {
        field: 'invStartDate', flex: 1, headerName: 'Start Date',
        cellRenderer: (params: ICellRendererParams) => {
          return this.datePipe.transform(params.value, 'MMM d, y');
        }
      },
      {
        field: 'invEndDate', flex: 1, headerName: 'End Date',
        cellRenderer: (params: ICellRendererParams) => {
          return this.datePipe.transform(params.value, 'MMM d, y');
        }
      },
      {
        field: 'deviceTrees',
        headerName: 'Inv Device',
        valueFormatter: this.deviceHardwareFormatter,
      }
    ];
  }

    // Custom Formatter for Device Hardware IDs
    deviceHardwareFormatter(params: any): string {
      if (params.value && Array.isArray(params.value)) {
        return params.value
          .map((device: any) => device.deviceHardwareID)
          .filter((id: string) => id)
          .join(' | ');
      }
      return '';
    }

    getReportingAuditResultCols(): ColDef[] {
      return [
        { field: 'astNum', headerName: 'Asset #' },
        { field: 'astID', headerName: 'Asset ID' },
        // { field: 'barcode', headerName: 'Barcode' },
        { field: 'fullBarcode', headerName: 'Full Barcode' },
        { field: 'shortBarcode', headerName: 'Short Barcode' },
        { field: 'astDesc1', headerName: 'Asset Description' },
        { field: 'astDesc2', headerName: 'Arabic Description' },
        { field: 'prevLoc', headerName: 'Previous Location' },
        { field: 'newLoc', headerName: 'Current Location' },
        { field: 'invDesc', headerName: 'Inventory Description' },
        { field: 'statusDesc', headerName: 'Audit Status' },
        { field: 'assetStatus', headerName: 'Asset Condition' },
        { field: 'astCnt', headerName: 'Asset Count' },
        { field: 'deviceID', headerName: 'Device ID' },
        { field: 'deviceDesc', headerName: 'Device Desc' },
        { field: 'processStatus', headerName: 'Status' },
        { field: 'hisDate', headerName: 'Last Post Date', cellRenderer: (params: ICellRendererParams) => {
          return this.datePipe.transform(params.value, 'MMM d, y');
        } },
      ]
    }

  getPoPreparationCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'poItmID', flex: 1, headerName: 'PO Item ID' },
      { field: 'itemCode', flex: 1, headerName: 'Item Code' },
      { field: 'itemCost', flex: 1, headerName: 'Item Cost',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'addCharges', flex: 1, headerName: 'Add. Charges',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'itemQuantity', flex: 1, headerName: 'Item Quantity' },
      { field: 'unitDesc', flex: 1, headerName: 'Unit' },
      { field: 'totalCost', flex: 1, headerName: 'Total Cost',valueFormatter: (params) => currencyFormatter(params.value) },
      this.getActionColumn(GridType.PoPreparation, permission)
    ];
  }

  getPoApprovalsCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'poCode', flex: 1, headerName: 'PO Code' },
      { field: 'transferStatus', flex: 1, headerName: 'Transfer Status' },
      { field: 'preparedby', flex: 1, headerName: 'Prepared by' },
      { field: 'approvedby', flex: 1, headerName: 'Approved by' },
      { field: 'addCharges', flex: 1, headerName: 'Add. Charges',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'amount', flex: 1, headerName: 'Amount',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'poDate', flex: 1, headerName: 'PO Date', cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      this.getActionColumn(GridType.PoApprovals, permission)
    ];
  }

  getApprovedPurchaseOrderCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'poCode', flex: 1, headerName: 'PO Code' },
      { field: 'poDate', flex: 1, headerName: 'poDate', cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'amount', flex: 1, headerName: 'Amount',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'addCharges', flex: 1, headerName: 'Additional Charges',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'approvedby', flex: 1, headerName: 'Approved By' },
      { field: 'transferStatus', flex: 1, headerName: 'Transfer' },
    ];
  }

  getPurchaseOrderCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'poItmID', flex: 1, headerName: 'PO Item Code' },
      { field: 'itemCode', flex: 1, headerName: 'Item Code' },
      { field: 'unitDesc', flex: 1, headerName: 'Item Description' },
      { field: 'itemCost', flex: 1, headerName: 'Item Cost',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'addCharges', flex: 1, headerName: 'Add. Charges',valueFormatter: (params) => currencyFormatter(params.value) },
      { field: 'itemQuantity', flex: 1, headerName: 'QTY' },
      { field: 'transferStatus', flex: 1, headerName: 'Transfer Status' },
      { field: 'recieve', flex: 1, headerName: 'Received' },
    ];
  }

  getAssetSearchCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'astNum', flex: 1, headerName: 'Asset #' },
      { field: 'itemCode', flex: 1, headerName: 'Item Code' },
      { field: 'astDesc', flex: 1, headerName: 'Description' },
      { field: 'astID', flex: 1, headerName: 'Asset ID' },
      { field: 'locationFullPath', flex: 1, headerName: 'Location' },
      { field: 'totalCost', flex: 1, headerName: 'Total Cost',valueFormatter: (params) => currencyFormatter(params.value) }
    ];
  }
  // Today

  getAdditionalCostHistoryCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'loginName', flex: 1, headerName: 'Login Name' },
      { field: 'actionDate', flex: 1, headerName: 'Action Date',cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'prevItemCost', flex: 1, headerName: 'Previous Item Cost',
        valueFormatter: (params) => currencyFormatter(params.value)
        // cellRenderer: (params: ICellRendererParams) => {
        //   return this.datePipe.transform(params.value, 'MMM d, y');
        // }
      },
      { field: 'additionalCost', flex: 1, headerName: 'Additional Cost',
        valueFormatter: (params) => currencyFormatter(params.value), },
      { field: 'typeDescription', flex: 1, headerName: 'Type Description' }
    ];
  }

  getCustodianHistoryCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'historyID', flex: 1, headerName: 'History ID' },
      { field: 'previousCustodian', flex: 1, headerName: 'Previous Custodian' },
      { field: 'currentCustodian', flex: 1, headerName: 'Current Custodian' },
      { field: 'hisDate', flex: 1, headerName: 'History Date',cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } }
    ];
  }

  getAssetBookListCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'bookID', flex: 1, headerName: 'Book ID' },
      { field: 'astID', flex: 1, headerName: 'Assert ID' },
      { field: 'description', flex: 1, headerName: 'Description' }
    ];
  }

  getAnualExpectedDepricationCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'year', flex: 1, headerName: 'Year' },
      { field: 'startValues', flex: 1, headerName: 'Start Value' },
      { field: 'depreciationExpenses', flex: 1, headerName: 'Deprec. Expense' },
      { field: 'accumulatedDepreciations', flex: 1, headerName: 'Accumulated. Deprec.' },
      { field: 'endValues', flex: 1, headerName: 'End Value' }
    ];
  }
  getMonthlyExpectedDepricationCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'year', flex: 1, headerName: 'Month' },
      { field: 'startValues', flex: 1, headerName: 'Start Value' },
      { field: 'depreciationExpenses', flex: 1, headerName: 'Deprec. Expense' },
      { field: 'accumulatedDepreciations', flex: 1, headerName: 'Accumulated. Deprec.' },
      { field: 'endValues', flex: 1, headerName: 'End Value' }
    ];
  }

  getFiscalYearDepreciationCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'year', flex: 1, headerName: 'Date' },
      { field: 'depreciationExpenses', flex: 1, headerName: 'Dep. Value' },
      { field: 'accumulatedDepreciations', flex: 1, headerName: 'Acc. Depreciation Value' },
      { field: 'startValues', flex: 1, headerName: 'CB Value' },
      { field: 'endValues', flex: 1, headerName: 'Sal Value' }
    ];
  }

  getDisposalOrSalesInfoCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'dispCode', flex: 1, headerName: 'Disposal Code' },
      { field: 'dispDesc', flex: 1, headerName: 'Disposal Desc' },
      this.getActionColumn(GridType.DisposalOrSalesInfo, permission)
    ];
  }

  getExtendedWarrantyCols(permission: any): ColDef[] {
    return [
      { field: '', headerName: '', width: 5, checkboxSelection: true },
      { field: 'id', headerName: 'id', width: 5, hide: true },
      { field: 'astID', headerName: 'astID', width: 5, hide: true },
      { field: 'warrantyStart', flex: 1, headerName: 'warranty Start',cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'warrantyPeriodMonth', flex: 1, headerName: 'warranty Period Month' },
      { field: 'enddate', flex: 1, headerName: 'warranty End Month',cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      this.getActionColumn(GridType.ExtendedWarranty, permission)
    ];
  }

  getTrackingHistroyCols(): ColDef[] {
    return [
      { field: 'historyID', headerName: '', width: 5, checkboxSelection: true },
      { field: 'historyID', flex: 1, headerName: 'History ID' },
      { field: 'invDesc', flex: 1, headerName: 'Inventory Schedule' },
      { field: 'astID', flex: 1, headerName: 'Asset ID' },
      { field: 'fromLocation', flex: 1, headerName: 'From Location' },
      { field: 'toLocation', flex: 1, headerName: 'To Location' },
      { field: 'hisDate', flex: 1, headerName: 'History Date',cellRenderer: (params: ICellRendererParams) => {
        return this.datePipe.transform(params.value, 'MMM d, y');
      } },
      { field: 'status', flex: 1, headerName: 'Status' },
      { field: 'deptName', flex: 1, headerName: 'Dept. Name' },
      { field: 'remarks', flex: 1, headerName: 'Remarks' },
      // this.getActionColumn(GridType.TrackingHistroy)
    ];
  }

  getOrganizationGroupsCols(permission: any): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'groupId', flex: 1, headerName: 'Group ID' },
      { field: 'groupDesc', flex: 1, headerName: 'Group Description' },
      { field: 'levelId', flex: 1, headerName: 'Level ID' },
      { field: 'levelDesc', flex: 1, headerName: 'Level Description' },
      this.getActionColumn(GridType.OrganizationGroups, permission)
    ];
  }

  getDataAcquisitionCols(): ColDef[] {
    return [
      { field: 'rowNo', headerName: '', width: 5, checkboxSelection: true },
      { field: 'deviceID', flex: 1, headerName: 'Device ID' },
      { field: 'deviceDesc', flex: 1, headerName: 'Description' },
      { field: 'commType', flex: 1, headerName: 'Type' },
      { field: 'deviceIp', flex: 1, headerName: 'Device IP' },
      { field: 'progress', flex: 1, headerName: 'Progress' }
    ];
  }
}
// DATA FORMATTING
function currencyFormatter(currency:any) {
  var sansDec = currency.toFixed(2);
  var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted}`;
}
