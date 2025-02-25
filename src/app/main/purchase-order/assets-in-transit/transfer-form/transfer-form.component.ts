import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, finalize } from 'rxjs';
import { Location } from '@angular/common'
import {
  emailRegex,
  noWhitespaceValidator,
  validateAllFormFields,
} from 'src/app/main/shared/helper/functions.component';
import { TableDataService } from 'src/app/main/shared/service/table-data.service';
import { toastService } from 'src/app/main/shared/toaster/toast.service';

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.scss'],
})
export class TransferFormComponent implements OnInit {
  gridView = [];
  public AssetList: any = [];
  public allCompanies: any = [];
  allCustodian: any = [];
  allBrand: any = [];
  allLocation: any = [];
  allSupplier: any = [];
  allGlCode: any = [];
  assetInTransitForm!: FormGroup;
  searchString: any;
  astDescription: string;
  catFullPath: string;
  itemCode: string;
  astCatID: string;
  astID: string;
  astNum: string;
  refNo: string;
  glOpened = false;
  locationOpened = false;
  custodianOpened = false;
  supplierOpened = false;
  companyOpened = false;
  brandOpened = false;
  glCodeForm: FormGroup;
  sendingRequest: boolean;
  brandForm: FormGroup;
  companyForm: FormGroup;
  supplierForm: FormGroup;
  custodianForm: FormGroup;
  locationForm: FormGroup;
  fetchingData: boolean;
  allDesignation: any;
  hierarchyList: any;
  custodianID: any;
  companyID: any;
  discount: any;
  tax: any;
  baseCost: any;
  quantity: any;
  invNumber: any;
  purchaseDate: any;
  poCode: any;
  serviceDate: any;
  suppID: any;
  astDesc2: any;
  astDesc: any;
  locID: any;
  glCode: any;
  astModel: any;
  astBrandID: any;
  serialNo: any;
  test: any;
  purchaseOrderGridView: any;

  constructor(
    private fb: FormBuilder,
    private toast: toastService,
    public tableDataService: TableDataService,
    private router: Router,
    private location: Location
  ) {
    if(this.router.getCurrentNavigation()?.extras?.state){
      console.log(this.router.getCurrentNavigation()?.extras)
      this.test = this.router.getCurrentNavigation()?.extras;
      this.getAllPurchaseOrderItem(
        this.test.state?.PoCode,
        this.test.state?.selectedItem.transferStatus
      );
    }else{
      this.location.back()
    }
  }

  ngOnInit(): void {
    this.GetAllAssetItems();
    this.initializeAssetInTransitForm();
    this.getAllCompanies();
    this.getAllCustodians();
    this.getAllBrands();
    this.getAllSuppliers();
    this.getAllGlCodes();
    // this.getAllCostCenters();
    // this.getAllOrganizationHierarchy();
    // this.getAllAssets();
    this.getAllDesignation();
    this.getAllOrganizationHierarchy();
    this.getAllLocations();
  }
  getAllPurchaseOrderItem(poCode: number, transferStatus: string) {
    this.tableDataService
      .getTableData('PO/GetAllPOItems', { get: 1, searching: 1, poCode })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.purchaseOrderGridView = res;
            this.purchaseOrderGridView.map((option: any) => {
              // New properties to be added
              const newPropsObj = {
                transferStatus: transferStatus,
              };

              // Assign new properties and return
              return Object.assign(option, newPropsObj);
            });
            // forEach(function (element) {
            //   element.Active = "false";
            // });
            // map(obj1 => ({ ...obj1, Active: 'false' }))
          } else this.toast.show(res.message, 'error');
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  initializeAssetInTransitForm() {
    this.assetInTransitForm = this.fb.group({
      // costID: [0],
      companyID: ['', [Validators.required, noWhitespaceValidator()]],
      itemCode: ['', [Validators.required, noWhitespaceValidator()]],
      astID: ['', [Validators.required, noWhitespaceValidator()]],
      refNo: ['', [Validators.required, noWhitespaceValidator()]],
      quantity: ['', [Validators.required, noWhitespaceValidator()]],
      baseCost: ['', [Validators.required, noWhitespaceValidator()]],
      custodianID: ['', [Validators.required, noWhitespaceValidator()]],
      serialNo: ['', [Validators.required, noWhitespaceValidator()]],
      poCode: ['', [Validators.required, noWhitespaceValidator()]],
      poItmID: [''],
      purchaseDate: ['', [Validators.required, noWhitespaceValidator()]],
      suppID: ['', [Validators.required, noWhitespaceValidator()]],
      tax: ['', [Validators.required, noWhitespaceValidator()]],
      glCode: ['', [Validators.required, noWhitespaceValidator()]],
      serviceDate: ['', [Validators.required, noWhitespaceValidator()]],
      astBrandID: ['', [Validators.required, noWhitespaceValidator()]],
      astDesc: ['', [Validators.required, noWhitespaceValidator()]],
      astDesc2: ['', [Validators.required, noWhitespaceValidator()]],
      astModel: ['', [Validators.required, noWhitespaceValidator()]],
      discount: ['', [Validators.required, noWhitespaceValidator()]],
      locID: ['', [Validators.required, noWhitespaceValidator()]],
      astNum: ['', [Validators.required, noWhitespaceValidator()]],
      invNumber: ['', [Validators.required, noWhitespaceValidator()]],
      astDescription: ['', [Validators.required, noWhitespaceValidator()]],
      catFullPath: ['', [Validators.required, noWhitespaceValidator()]],
    });
  }
  submit() {
    this.assetInTransitForm.controls['poItmID'].setValue(
      this.itemCode
    );
    if (this.assetInTransitForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.tableDataService.getTableData('PO/TransferAssetsFromPOToERP', {
            add: 1,
            ...this.assetInTransitForm.value,
          });
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            // this.setAllValues(this.astID, true);
            // this.router.navigate(['main/master-data/custodians'])
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.assetInTransitForm)
    }
  }
  getAllDesignation() {
    this.fetchingData = true;
    this.tableDataService
      .getTableData('Designation/GetAllDesignations', { get: 1 })
      .pipe(
        first(),
        finalize(() => (this.fetchingData = false))
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.allDesignation = res.reverse();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
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
  getAllGlCodes() {
    this.tableDataService
      .getTableData('GLCodes/GetAllGLCodes', {
        get: 1,
        searching: 1,
        var: this.searchString,
      })
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.allGlCode = res.reverse();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  getAllBrands() {
    this.tableDataService
      .getTableData('Brands/GetAllBrands', {
        get: 1
      })
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.allBrand = res;
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  public getAllLocations() {
    this.tableDataService
      .getTableDataGet('Locations/GetAllLocations')
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.allLocation = res.reverse();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllSuppliers() {
    this.tableDataService
      .getTableData('Supplier/GetAllSuppliers', {
        get: 1,
        searching: 0,
        var: this.searchString,
      })
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.allSupplier = res.reverse();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  public setAssetValues(e: any) {
    let asset = this.AssetList.find((x: { itemCode: any }) => x.itemCode == e);
    this.astDescription = asset.astDesc;
    this.catFullPath = asset.catFullPath;
    this.SearchAssets();
  }
  SearchAssets() {
    this.tableDataService
      .getTableData('Assets/SearchAssets', {
        get: 1,
        searching: 1,
        itemCode: this.itemCode,
        astCatID: this.astCatID,
      })
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.astID = res[0].astID;
            this.astNum = res[0].astNum;
            this.refNo = res[0].astNum;
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }

  getAllCustodians() {
    this.tableDataService
      .getTableData('Custodians/GetAllCustodians', {
        get: 1,
        searching: 0,
        var: this.searchString,
      })
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.allCustodian = res;
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  getAllCompanies() {
    this.tableDataService
      .getTableData('Company/GetAllCompanies', { get: 1 })
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (res: any) => {
          if (res) {
            this.allCompanies = res;
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  GetAllAssetItems() {
    // this.fetchingData = true
    this.tableDataService
      .getTableData('Assets/GetAllAssetItems', {
        get: 1,
        searching: 0,
        var: this.searchString,
      })
      .pipe(
        first(),
        finalize(() => {})
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.AssetList = res;
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) =>
          this.toast.show(err ?? 'Something went wrong!', 'error'),
      });
  }
  openCompanyDialog() {
    this.companyOpened = true;
    this.initializeCompanyForm();
  }
  openCustodianDialog() {
    this.custodianOpened = true;
    this.initializecustodianForm();
  }
  openBrandDialog() {
    this.brandOpened = true;
    this.initializebrandForm();
  }
  openLocationDialog() {
    this.initializeLocationForm();
    this.locationOpened = true;
  }
  openSupplierDialog() {
    this.supplierOpened = true;
    this.initializesupplierForm();
  }
  openGLDialog() {
    this.glOpened = true;
    this.initializeGlCodeForm();
  }

  closeCompanyDialog(status: string) {
    if (status === 'yes') {
      this.onSubmitCompany();
    } else {
      this.companyOpened = false;
    }
  }
  closeCustodianDialog(status: string) {
    if (status === 'yes') {
      this.onSubmitCustodian();
    } else {
      this.custodianOpened = false;
    }
  }
  closeBrandDialog(status: string) {
    if (status === 'yes') {
      this.onSubmitBrand();
    } else {
      this.brandOpened = false;
    }
  }
  closeLocationDialog(status: string) {
    if (status === 'yes') {
      this.onSubmitLocation();
    } else {
      this.locationOpened = false;
    }
  }
  closeSupplierDialog(status: string) {
    if (status === 'yes') {
      this.onSubmitSupplier();
    } else {
      this.supplierOpened = false;
    }
  }
  closeGLDialog(status: string) {
    if (status === 'yes') {
      this.onSubmitGL();
    } else {
      this.glOpened = false;
    }
  }

  initializeGlCodeForm() {
    this.glCodeForm = this.fb.group({
      glCode: [0],
      companyName: ['', [Validators.required, noWhitespaceValidator()]],
      glDesc: ['', [Validators.required, noWhitespaceValidator()]],
    });
  }

  initializebrandForm() {
    this.brandForm = this.fb.group({
      astBrandID: [0],
      astBrandName: ['', [Validators.required, noWhitespaceValidator()]],
    });
  }

  initializeCompanyForm() {
    this.companyForm = this.fb.group({
      companyId: [0],
      companyCode: ['', [Validators.required, noWhitespaceValidator()]],
      companyName: ['', [Validators.required, noWhitespaceValidator()]],
    });
  }

  initializesupplierForm() {
    this.supplierForm = this.fb.group({
      suppID: ['', [Validators.required, noWhitespaceValidator()]],
      suppName: ['', [Validators.required, noWhitespaceValidator()]],
      suppPhone: [''],
      suppFax: [''],
      suppCell: [''],
      suppEmail: ['', Validators.pattern(emailRegex)],
    });
  }

  initializecustodianForm() {
    this.custodianForm = this.fb.group({
      // custodianID: [''],
      custodianName: ['', [Validators.required, noWhitespaceValidator()]],
      custodianPhone: [''],
      custodianEmail: ['', Validators.pattern(emailRegex)],
      custodianFax: [''],
      custodianCell: [''],
      custodianAddress: [''],
      orgHierID: [''],
      designationID: [''],
    });
  }
  initializeLocationForm() {
    this.locationForm = this.fb.group({
      locCode: ['', [Validators.required, noWhitespaceValidator()]],
      companyId: ['', [Validators.required, noWhitespaceValidator()]],
      locDesc: ['', [Validators.required, noWhitespaceValidator()]],
    });
  }

  onSubmitGL() {
    if (this.glCodeForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.tableDataService.getTableData(
        'GlCodes/InsertGLCode',
        {
          add: 1,
          ...this.glCodeForm.value,
        }
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.glOpened = false;
            this.getAllGlCodes();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.glCodeForm);
    }
  }

  onSubmitBrand() {
    if (this.brandForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.tableDataService.getTableData(
        'Brands/Insertbrand',
        {
          add: 1,
          ...this.brandForm.value,
        }
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.brandOpened = false;
            this.getAllBrands();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.brandForm);
    }
  }

  onSubmitCompany() {
    if (this.companyForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.tableDataService.getTableData(
        'Company/InsertCompany',
        {
          add: 1,
          ...this.companyForm.value,
        }
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.companyOpened = false;
            this.getAllCompanies();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.companyForm);
    }
  }

  onSubmitCustodian() {
    if (this.custodianForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.tableDataService.getTableData(
        'Custodians/InsertCustodian',
        {
          add: 1,
          ...this.custodianForm.value,
        }
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.custodianOpened = false;
            this.getAllCustodians();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.custodianForm);
    }
  }

  onSubmitSupplier() {
    if (this.supplierForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.tableDataService.getTableData(
        'Supplier/InsertSupplier',
        {
          add: 1,
          ...this.supplierForm.value,
        }
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.supplierOpened = false;
            this.getAllSuppliers();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.supplierForm);
    }
  }
  onSubmitLocation() {
    if (this.locationForm.valid) {
      this.sendingRequest = true;
      const apiCall$ = this.tableDataService.getTableData(
        'Locations/InsertLocation',
        {
          add: 1,
          ...this.locationForm.value,
        }
      );
      apiCall$.pipe(finalize(() => (this.sendingRequest = false))).subscribe({
        next: (res) => {
          if (res && res.status === '200') {
            this.toast.show(res.message, 'success');
            this.locationOpened = false;
            this.getAllLocations();
          } else {
            this.toast.show(res.message, 'error');
          }
        },
        error: (err) => {
          this.toast.show(err.title, 'error');
        },
      });
    } else {
      validateAllFormFields(this.locationForm);
    }
  }
}
