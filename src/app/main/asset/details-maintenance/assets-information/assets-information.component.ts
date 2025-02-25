import { GeneralService } from 'src/app/main/shared/service/general.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-excel-export';
import { CustomvalidationService } from 'src/app/main/shared/service/customvalidation.service';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';
import { DetailMaintenanceService } from '../detail-maintenance.service';
import { finalize, first } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from 'src/app/main/shared/helper/functions.component';
import { AssetSearchDto } from 'src/app/main/shared/dtos/AssetsSearch/AssetSearchDto';
import {
  CompanyDto,
  CompanyDtoResponse,
} from 'src/app/main/shared/dtos/Companies/companyDtos';
import {
  AssetItemsDto,
  AssetItemsDtoResponse,
} from 'src/app/main/shared/dtos/AssetItems/AssetItemsDto';
import {
  CustodiansDto,
  CustodiansDtoResponse,
} from 'src/app/main/shared/dtos/Custodians/CustodiansDto';
import {
  BrandsDto,
  BrandsDtoResponse,
} from 'src/app/main/shared/dtos/Brands/BrandsDto';
import {
  GLCodesDto,
  GLCodesDtoResponse,
} from 'src/app/main/shared/dtos/GL-Codes/GLCodesDto';
import {
  CostCentersDto,
  CostCentersDtoResponse,
} from 'src/app/main/shared/dtos/CostCenters/CostCentersDto';
import { addDays, addMonths } from '@progress/kendo-date-math';
import { FilterExpandSettings } from '@progress/kendo-angular-treeview';
import { ConfirmationDialogService } from 'src/app/main/shared/service/confirmation-dialog.service';

interface LocationNodeFlat {
  parentid: string;
  locID: string;
  locDesc: string;
  isDeleted: boolean;
  iD1: number;
  code: string;
  compCode: string;
  locationFullPath: string;
  companyID: number;
  locLevel: number;
  children?: LocationNodeFlat[];
}
@Component({
  selector: 'app-assets-information',
  templateUrl: './assets-information.component.html',
  styleUrls: ['./assets-information.component.scss'],
})
export class AssetsInformationComponent implements OnInit {
  @Output() detailsMaintenanceData = new EventEmitter();
  @Input() detailsMaintenanceDataReturn: any;

  @Output() astIDforParrent = new EventEmitter();
  @Input() parrentAstID: any;

  assetsInformationForm!: FormGroup;
  sendingRequest: boolean = false;
  today = new Date();
  public hierarchyList: any = [];
  public AssetList: any = [];
  astDescription: any;
  Hierarchy: any;
  catFullPath: any;
  itemCode: any;
  companyId: any;
  AssetsNum: any;
  astID: any = this.formatAssetTime();
  refCode: any;
  custodianID: any;
  astBrandID: any;
  AssetType: any = 'Piece   ';
  glCode: any;
  statusID: any = 1;
  locid: any;
  barCode: any;
  costID: any;
  RFID: any;
  astDesc1: any;
  astDesc2: any;
  purDate: any = this.today;
  srvDate: any = this.today;
  Age: any;
  warranty: any;
  WarrantyExpireDate: any = this.today;
  baseCost: any = 0;
  totalAdditionalCost: any = 0;
  dataItem: any;
  discount: any = 0;
  totalCost: any = 0;
  isEditMode: any = false;
  allStatus: any;
  assetInfo: any;
  public dataItemCode: AssetItemsDto[] = [];
  public dataCompany: CompanyDto[] = [];
  public dataAssetId: AssetSearchDto[] = [];
  public dataCustodian: CustodiansDto[] = [];
  public dataBrand: BrandsDto[] = [];
  public dataGlCode: GLCodesDto[] = [];

  public dataStatus: Array<{ name: string; id: number }>;
  public dataLocation: any;
  public dataCost: CostCentersDto[] = [];
  present_date: any = new Date();
  // ddl: any;
  public virtual: any = {
    itemHeight: 30,
  };
  onDistroy: any = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toast: toastService,
    private confirmationDialogService: ConfirmationDialogService,
    public detailMaintenanceService: DetailMaintenanceService,
    public tableDataService: TableDataService,
    public el : ElementRef,
    private router: Router,
    public GeneralService: GeneralService
  ) {}

  //   ngOnDestroy() {
  //     this.onDistroy = true;
  //     // this.submit();
  //     console.log('On Destroyedddd');
  //     //
  // }
  validateForm(): boolean {
    if (this.assetsInformationForm.invalid) {
      validateAllFormFields(this.assetsInformationForm); // Show validation errors
      return false;
    }
    return true;
  }
  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;

    this.initializeAssetForm();
    this.getAllLocations();
    this.GetAllAssetItems();

    // this.astID = this.formatAssetTime();
    if (this.detailsMaintenanceDataReturn != undefined) {
      this.assetInfo =
        this.detailsMaintenanceDataReturn.assetInformationExtendentedInformation[0];
      this.isEditMode = true;
      this.itemCode = this.assetInfo.itemCode;
      this.astDescription = this.assetInfo.astDesc;
      this.catFullPath = this.assetInfo.astCatDesc;
      this.companyId = this.assetInfo.companyID;
      this.getAllGlCodes(this.assetInfo.companyID);

      this.custodianID = this.assetInfo.custodianID;
      this.AssetsNum = this.assetInfo.astNum;
      this.astID = this.assetInfo.astID;
      this.refCode = this.assetInfo.refNo;
      this.Hierarchy = this.assetInfo.orgHierName;
      this.astBrandID = this.assetInfo.astBrandId;
      this.AssetType = 'Piece   ';
      this.glCode = this.assetInfo.glCode;
      this.statusID = this.assetInfo.statusID;
      // this.locid = this.assetInfo.locID;

      this.barCode = this.assetInfo.barCode;
      this.costID = this.assetInfo.costCenterID;
      this.RFID = this.assetInfo.refCode;
      this.astDesc1 = this.assetInfo.astDesc;
      this.astDesc2 = this.assetInfo.astDesc2;
      this.purDate = new Date(this.assetInfo.purchaseDate);
      this.srvDate = new Date(this.assetInfo.serviceDate);
      this.Age = Math.floor(
        (this.present_date.getTime() - this.purDate.getTime()) /
          (1000 * 3600 * 24)
      );
      this.warranty = this.assetInfo.warranty;
      this.totalAdditionalCost = this.assetInfo.tax
      this.baseCost = this.assetInfo.baseCost;
      this.discount = this.assetInfo.discount;
      this.totalCost = this.assetInfo.baseCost + this.totalAdditionalCost;
      // this.handleLoc(this.assetInfo.locID);
      // this.locid = this.assetInfo.locID;

      this.WarrantyExpireDate = addMonths(
        new Date(this.assetInfo.serviceDate),
        this.assetInfo.warranty
      );
    }
    this.getAllCompanies();
    this.getAllCustodians();
    this.getAllBrands();
    // this.getAllGlCodes();
    this.getAllCostCenters();
    // this.getAllOrganizationHierarchy();
    this.getAllAssets();
    this.getAllAssetsCount();
    this.getAllStatus();

    // this.setAllValues('23190311392832', true);//23190311392373
    if (queryParams && 'astID' in queryParams && queryParams != undefined) {
      console.log('queryParams', queryParams);
      this.setAllValues(queryParams['astID'], true);
    }
  }

  initializeAssetForm(data?: any) {
    this.assetsInformationForm = this.fb.group({
      ItemCode: ['', [Validators.required, noWhitespaceValidator()]],
      astDesc: [''],
      category: [{ value: '', disabled: true }],
      companyID: ['', [Validators.required, noWhitespaceValidator()]],
      AssetsNum: [{ value: '', disabled: true }],
      astID: ['', [Validators.required, noWhitespaceValidator()]],
      refCode: ['', [Validators.required, noWhitespaceValidator()]],
      custodianID: ['', [Validators.required, noWhitespaceValidator()]],
      Hierarchy: [{ value: '', disabled: true }],
      astBrandId: ['', [Validators.required, noWhitespaceValidator()]],
      AssetType: [''],
      glCode: ['', [Validators.required, noWhitespaceValidator()]],
      statusID: ['', [Validators.required, noWhitespaceValidator()]],
      locID: ['', [Validators.required, noWhitespaceValidator()]],
      barCode: [{ value: '', disabled: true }],
      costCenterID: [''],
      RFID: [''],
      astDesc1: [{ value: '', disabled: true }],
      astDesc2: [''],
      srvDate: [''],
      Age: [{ value: '', disabled: true }],
      warranty: [''],
      WarrantyExpireDate: [{ value: '', disabled: true }],
      baseCost: [0],
      tax: [0],
      discount: [0],
      totalCost: [{ value: 0, disabled: true }],
      purDate: ['', [Validators.required, noWhitespaceValidator()]],
      BookID: ['1'],
      // invStartDate: [this.today, [Validators.required, noWhitespaceValidator()]],
      // invEndDate: [this.today, [Validators.required, noWhitespaceValidator()]],
    });
  }
  formatAssetTime() {
    const d = new Date();
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear().toString().substr(-2);
    let seconds = d.getSeconds();
    let minutes = d.getMinutes();
    let hour = d.getHours();
    let ms = d.getMilliseconds().toString().substr(-2);
    return year + day + month + hour + minutes + seconds + ms;
  }
  submit(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.astIDforParrent.emit(this.astID);

      if (this.assetsInformationForm.valid) {
        this.sendingRequest = true;

        const apiCall$ = this.isEditMode
          ? this.tableDataService.getTableData('Assets/UpdateAssetDetails', {
              update: 1,
              ...this.assetsInformationForm.getRawValue(),
            })
          : this.tableDataService.getTableData('Assets/InsertAssetDetails', {
              add: 1,
              ...this.assetsInformationForm.getRawValue(),
            });

        apiCall$
          .pipe(finalize(() => (this.sendingRequest = false)))
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                if (!this.onDistroy) {
                  this.toast.show(res.message, 'success');
                }
                this.setAllValues(this.astID, true).then((data: any) => {
                  resolve(data); // Resolve the promise with data
                });
              } else {
                this.toast.show(res.message, 'error');
                reject(); // Reject on failure
              }
            },
            error: (err) => {
              this.toast.show(err.title, 'error');
              reject(); // Reject on API error
            },
          });
      } else {
        validateAllFormFields(this.assetsInformationForm, this.el);
        reject(); // Reject if form is invalid
      }
    });
  }


  public setAllValues(e: any, isSubmit: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fetchingData = true;
      this.tableDataService
        .getTableData('Assets/GetAstInfoByAstID', {
          get: 1,
          searching: 1,
          astID: e,
        })
        .pipe(
          first(),
          finalize(() => (this.fetchingData = false))
        )
        .subscribe({
          next: (result) => {
            if (result.hasOwnProperty('assetInformationExtendentedInformation')) {
              this.isEditMode = true;
              this.detailsMaintenanceData.emit(result);
              resolve(result); // Resolve promise with the data
              this.assetInfo = result.assetInformationExtendentedInformation[0];
              this.itemCode = this.assetInfo.itemCode;
              this.catFullPath = this.assetInfo.astCatDesc;
            this.custodianID = this.assetInfo.custodianID;
            this.companyId = this.assetInfo.companyID;
            this.getAllGlCodes(this.assetInfo.companyID);
            this.AssetsNum = this.assetInfo.astNum;
            this.astID = this.assetInfo.astID;
            this.refCode = this.assetInfo.refNo;
            this.Hierarchy = this.assetInfo.orgHierName;
            this.astBrandID = this.assetInfo.astBrandId;
            this.AssetType = 'Piece   ';
            this.glCode = this.assetInfo.glCode;
            this.statusID = this.assetInfo.statusID;
            this.barCode = this.assetInfo.barCode;
            this.costID = this.assetInfo.costCenterID;
            this.RFID = this.assetInfo.refCode;
            this.astDesc1 = this.assetInfo.astDesc;
            this.astDesc2 = this.assetInfo.astDesc2;
            this.purDate = new Date(this.assetInfo.purchaseDate);
            this.srvDate = new Date(this.assetInfo.serviceDate);
            this.Age = Math.floor(
              (this.present_date.getTime() - this.purDate.getTime()) /
                (1000 * 3600 * 24)
            );
            this.warranty = this.assetInfo.warranty;
            this.baseCost = this.assetInfo.baseCost;
            this.discount = this.assetInfo.discount;

            this.totalAdditionalCost = this.assetInfo.tax
            console.log(this.totalAdditionalCost, 'totalAdditionalCost');
            this.totalCost = this.assetInfo.baseCost + this.totalAdditionalCost;

            this.WarrantyExpireDate = addMonths(
              new Date(this.assetInfo.serviceDate),
              this.assetInfo.warranty
            );
            this.handleLoc(this.assetInfo.locID);
            this.locid = this.assetInfo.locID;
            this.astDescription = this.getItemAstDesc(this.itemCode);
              // Populate additional fields here...
            } else {
              this.toast.show(result.message ?? 'Something went wrong!', 'error');
              reject(); // Reject on unexpected response
            }
          },
          error: (err) => {
            this.toast.show(err ?? 'Something went wrong!', 'error');
            reject(); // Reject on API error
          },
        });
    });
  }

  clear() {
    // console.log(event,'event');
    this.itemCode = null;
    this.astDescription = '';
    this.catFullPath = '';
    this.custodianID = null;
    this.companyId = null;
    this.AssetsNum = '';
    this.refCode = '';
    this.Hierarchy = '';
    this.astBrandID = null;
    this.AssetType = 'Piece   ';
    this.glCode = null;
    this.statusID = null;
    this.barCode = '';
    this.costID = null;
    this.RFID = '';
    this.astDesc1 = '';
    this.astDesc2 = '';
    this.purDate = new Date();
    this.srvDate = new Date();
    this.Age = 0;
    this.warranty = 0;
    this.baseCost = 0;
    this.discount = 0;

    this.totalAdditionalCost = 0;
    this.totalCost = this.baseCost + this.totalAdditionalCost;
    this.WarrantyExpireDate = addMonths(new Date(this.srvDate), this.warranty);
    this.locid = null;
    this.detailsMaintenanceData.emit(null);
    this.getAllAssetsCount();
    let assetTime = this.formatAssetTime();
    this.AssetList.unshift({
      astID: assetTime,
      astDesc: '',
    });
    this.astID = assetTime;
    this.isEditMode = false;
    this.allGlCode = [];
    this.dataGlCode = [];
  }
  image: any = '';
  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const base64Image: string = e.target.result;
      this.image = base64Image;
      this.detailMaintenanceService.detailForm.patchValue({
        imageBase64: this.image,
      });
      console.log(base64Image); // You can perform further operations with the base64 image
    };

    reader.readAsDataURL(file);
  }

  public setAssetValues(e: any) {
    let asset = this.allAssets.find((x: AssetItemsDto) => x.itemCode == e);
    this.astDescription = asset?.astDesc;
    this.catFullPath = asset?.catFullPath;
    this.itemCode = asset?.itemCode;
  }
  public setCustodianValues(e: any) {
    let asset = this.allCustodian.find(
      (x: CustodiansDto) => x.custodianID == e
    );
    this.Hierarchy = asset?.orgHierName;
    // this.catFullPath = asset.catFullPath;
  }
  public setBarCodesValues(e: any) {
    console.log('comapnyID', e);
    let Company = this.allCompanies.find((x: CompanyDto) => x.companyId == e);
    this.barCode = Company?.barCode;
    this.getAllGlCodes(e);
    // this.catFullPath = asset.catFullPath;
  }


  allCompanies: CompanyDto[] = [];
  fetchingData: boolean = false;
  getAllOrganizationHierarchy() {
    this.tableDataService
      .getTableData('OrgHier/GetAllOrgHier', { get: 1, searching: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.hierarchyList = res.reverse();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllAssets() {
    this.tableDataService
      .getTableData('Assets/GetAllAssetsAdministrator', { get: 1, dropdown: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.AssetList = res.data.reverse();
            this.dataAssetId = this.AssetList.slice();
            console.log(this.AssetList, 'asset');
            let assetTime = this.formatAssetTime();
            if (this.detailsMaintenanceDataReturn == undefined) {
              this.AssetList.unshift({
                astID: assetTime,
                astNum: 0,
                itemCode: 0,
                astDesc: '',
                locationFullPath: '',
                custodianName: '',
                astBrandId: 0,
                brandName: '',
                locID: '',
                astCatID: '',
                custodianID: '',
                totalCost: 0,
                discount: 0,
                'serial#': '',
              });
              this.astID = assetTime;
            }
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllAssetsCount() {
    this.tableDataService
      .getTableDataGet('Dashboard/GetAllDashboardCounts')
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.AssetsNum = res[0].assetDetailsCount + 1;
            this.refCode = this.AssetsNum;
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllCompanies() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Company/GetAllCompanies', { get: 1, dropDown: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CompanyDtoResponse) => {
          if (res) {
            this.allCompanies = res.data.reverse();
            this.dataCompany = this.allCompanies.slice();
            console.log(this.allCompanies, 'company');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  allAssets: AssetItemsDto[] = [];
  searchString = '';
  GetAllAssetItems() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Assets/GetAllAssetItems', { get: 1, dropDown: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: AssetItemsDtoResponse) => {
          if (res) {
            this.allAssets = res.data.reverse();
            this.dataItemCode = this.allAssets.slice();

            console.log(this.dataItemCode, 'dataItemCode');
            if (this.assetInfo != undefined) {
              this.astDescription = this.getItemAstDesc(this.itemCode);
            }
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  allCustodian: CustodiansDto[] = [];
  getAllCustodians() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Custodians/GetAllCustodians', { get: 1, dropDown: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CustodiansDtoResponse) => {
          if (res) {
            this.allCustodian = res.data.reverse();
            this.dataCustodian = this.allCustodian.slice();
            console.log(this.allCustodian, 'custodian');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  allBrand: BrandsDto[] = [];
  getAllBrands() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Brands/GetAllBrands', { get: 1, dropDown: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: BrandsDtoResponse) => {
          if (res) {
            this.allBrand = res.data.reverse();
            this.dataBrand = this.allBrand.slice();
            console.log(this.allBrand, 'brandd');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  allGlCode: GLCodesDto[] = [];
  getAllGlCodes(companyID: number) {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Company/GetGLCodesAgainstCompanyID', { id: companyID })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.allGlCode = res.reverse();
            this.dataGlCode = this.allGlCode.slice();
            console.log(this.dataGlCode, 'Glcode');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  locationList: any;
  public getAllLocations() {
    this.tableDataService
      .getTableData('Locations/GetAllLocationsTreeView', {
        get: 1,
        searching: 1,
      })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.locationList = res;
            if (this.assetInfo != undefined) {
              this.handleLoc(this.assetInfo.locID);
              this.locid = this.assetInfo.locID;
            }

            this.dataLocation = this.treeConstructLoc(res);
            console.log(this.dataLocation, 'locationListdrop');
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  allCostCenter: CostCentersDto[] = [];

  getAllCostCenters() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('CostCenter/GetAllCostCenters', { get: 1, dropDown: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: CostCentersDtoResponse) => {
          if (res) {
            this.allCostCenter = res.data.reverse();
            this.dataCost = this.allCostCenter.slice();
            console.log(this.allCostCenter, 'cost centre');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllStatus() {
    this.fetchingData = true;
    this.tableDataService
      .getTableDataGet('Assets/GetAssetsStatusWeb')
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.allStatus = res.data.reverse();
            this.dataStatus = this.allStatus.slice();
            console.log(this.allStatus, 'Status');
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  handleItemCode(value: any) {
    this.dataItemCode = this.allAssets.filter(
      (s: any) =>
        (s.itemCode + '-' + s.astDesc)
          .toLowerCase()
          .indexOf(value.toLowerCase()) !== -1
    );
  }

  handleCompany(value: any) {
    this.dataCompany = this.allCompanies.filter(
      (s: any) =>
        s.companyName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleAssetId(value: any) {
    this.AssetList = this.dataAssetId.filter(
      (s: any) =>
        (s.astID + '-' + s.astDesc)
          .toLowerCase()
          .indexOf(value.toLowerCase()) !== -1
    );
  }

  getItemAstDesc(id: any) {
    let item: any;
    if(this.allAssets != undefined){
      item = this.allAssets.find((s: any) => s.itemCode == id);
      console.log(item, 'iteeeeeeem');
       return item?.astDesc || '';
    }else{
      return '';
    }


  }

  handleCustodian(value: any) {
    this.dataCustodian = this.allCustodian.filter(
      (s: any) =>
        s.custodianName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleBrand(value: any) {
    this.dataBrand = this.allBrand.filter(
      (s: any) =>
        s.astBrandName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleGlCode(value: any) {
    this.dataGlCode = this.allGlCode.filter(
      (s: any) => s.glDesc.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleStatus(value: any) {
    this.dataStatus = this.allStatus.filter(
      (s: any) => s.status.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleCost(value: any) {
    this.dataCost = this.allCostCenter.filter(
      (s: any) => s.costName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  handleLoc(value: any) {
    this.dataItem = this.locationList.find((id: any) => id.locID === value);
    console.log(this.dataItem, 'dataItem');
  }

  calc() {
    this.WarrantyExpireDate = addMonths(this.srvDate, this.warranty);
  }
  get filterExpandSettings(): FilterExpandSettings {
    return { expandMatches: true };
  }
  treeConstructLoc(treeData: LocationNodeFlat[]) {
    let constructedTree: never[] = [];
    for (let i of treeData) {
      let treeObj = i;
      let assigned = false;
      if (treeObj) {
        this.constructTreeLoc(constructedTree, treeObj, assigned);
      }
    }
    return constructedTree;
  }

  constructTreeLoc(
    constructedTree: any,
    treeObj: LocationNodeFlat,
    assigned: boolean
  ) {
    // console.log('test', treeObj.locLevel)
    if (treeObj.locLevel == 0 || treeObj.locLevel == null) {
      treeObj.children = [];
      constructedTree.push(treeObj);
      return true;
    } else if (
      treeObj.locID.slice(0, treeObj.locID.lastIndexOf('-')) ==
      constructedTree.locID
    ) {
      treeObj.children = [];
      constructedTree.children.push(treeObj);
      constructedTree.children = constructedTree.children.filter(
        (value: { iD1: any }, index: any, self: any[]) =>
          index === self.findIndex((t) => t.iD1 === value.iD1)
      );
      return true;
    } else {
      if (constructedTree.children != undefined) {
        for (let index = 0; index < constructedTree.children.length; index++) {
          let constructedObj = constructedTree.children[index];
          if (assigned == false) {
            assigned = this.constructTreeLoc(constructedObj, treeObj, assigned);
          }
        }
      } else {
        for (let index = 0; index < constructedTree.length; index++) {
          let constructedObj = constructedTree[index];
          if (assigned == false) {
            assigned = this.constructTreeLoc(constructedObj, treeObj, assigned);
          }
        }
      }
      return false;
    }
  }

  totalVal() {
    this.totalCost = this.baseCost + this.totalAdditionalCost;
  }

  remove() {
    this.confirmationDialogService.confirm().then((confirmed) => {
      if (confirmed) {
        this.sendingRequest = true;
        this.tableDataService
          .getTableData('Assets/DeleteAssetItem', {
            delete: 1,
            astID: this.astID,
          })
          .pipe(
            first(),
            finalize(() => (this.fetchingData = false))
          )
          .subscribe({
            next: (res) => {
              if (res && res.status === '200') {
                this.toast.show(res.message, 'success');
                this.clear();
              } else {
                this.toast.show(res.message, 'error');
              }
            },
            error: (err) =>
              this.toast.show(err ?? 'Something went wrong!', 'error'),
          });
      }
    });
  }
}
