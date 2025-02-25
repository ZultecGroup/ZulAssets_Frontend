import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DrawerItem, DrawerItemExpandedFn, DrawerMode, DrawerSelectEvent } from '@progress/kendo-angular-layout';
import { AuthService } from './shared/service/auth.service';
import { toastService } from './shared/toaster/toast.service';
import { TokenStorageService } from './shared/service/token-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { GeneralService } from './shared/service/general.service';
import { first, Subject, takeUntil } from 'rxjs';
import { TableDataService } from './shared/service/table-data.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public mode: DrawerMode = 'push';
  public selected = 'Dashboard';
  expanded = true;
  private rtl = false;
  public margin = { horizontal: -66, vertical: 7 };
  private unsubscribe: Subject<void> = new Subject();
  @ViewChild('drawer') drawer: any;

  mainMenus = [
    {
      text: 'Dashboard',
      translationtextKey: 'Dashboard',
      // icon: "k-i-home",
      selected: true,
      id: 1,
      path: 'main/dashboard',
    },
    {
      text: 'File',
      translationtextKey: 'File',
      // icon: "k-i-home",
      id: 58,
    },
    {
      text: 'Security',
      translationtextKey: 'Security',
      // icon: "k-i-data",
      id: 2,
    },
    {
      text: 'Master Data',
      translationtextKey: 'Master Data',
      // icon: "k-i-file-data",
      id: 5,
    },
    {
      text: 'Company Profile',
      translationtextKey: 'Company Profile',
      // icon: "k-i-folder",
      id: 22,
    },
    {
      text: 'Asset',
      translationtextKey: 'Asset',
      // icon: "k-i-folder",
      id: 40,
    },
    {
      text: 'Purchase Order',
      translationtextKey: 'Purchase Order',
      // icon: "k-i-folder",
      id: 25,
    },
    {
      text: 'Tools',
      translationtextKey: 'Tools',
      // icon: "k-i-toolbar-float",
      id: 20,
    },
    {
      text: 'Communication',
      translationtextKey: 'Communication',
      // icon: "k-i-folder",
      id: 39,
    },
    {
      text: 'Reporting',
      translationtextKey: 'Reporting',
      id: 59,
    },
  ];
  dashboardMenus = [];
  fileMenus = [
    {
      text: 'Import File',
      translationtextKey: 'Import File',
      icon: 'k-i-import',
      id: 88,
      parentId: 58,
      path: 'main/file/import-file',
    },
  ];
  companyProfileMenus = [
    {
      text: 'Companies',
      translationtextKey: 'Companies',
      icon: 'k-i-transparency',
      id: 23,
      parentId: 22,
      path: 'main/company-profile/companies',
    },
    {
      text: 'Organization Hierarchy',
      translationtextKey: 'Organization Hierarchy',
      icon: 'k-i-inherited',
      id: 28,
      parentId: 22,
      path: 'main/company-profile/organization-hierarchy',
    },
    {
      text: 'Organization Levels',
      translationtextKey: 'Organization Levels',
      icon: 'k-i-group-section',
      id: 27,
      parentId: 22,
      path: 'main/company-profile/levels',
    },
    {
      text: 'Locations',
      translationtextKey: 'Locations',
      icon: 'k-i-hyperlink-globe',
      id: 24,
      parentId: 22,
      path: 'main/company-profile/locations',
    },
    {
      text: 'Barcode Company Policy',
      translationtextKey: 'Barcode Company Policy',
      icon: 'k-i-decimal-increase',
      id: 29,
      parentId: 22,
      path: 'main/company-profile/bar-coding-policy',
    },
    {
      text: 'Assets Coding Definition',
      translationtextKey: 'Assets Coding Definition',
      icon: 'k-i-table-properties',
      id: 30,
      parentId: 22,
      path: 'main/company-profile/assets-coding-definition',
    },
    {
      text: 'Depreciation Policy',
      translationtextKey: 'Depreciation Policy',
      icon: 'k-i-paste',
      id: 31,
      parentId: 22,
      path: 'main/company-profile/depreciation-policy',
    },
    // {
    //   text: "Administrator",
    //   icon: "k-i-radiobutton-checked",
    //   id: 31,
    //   parentId: 22,
    //   path: 'main/company-profile/administrator'
    // },
  ];
  toolsMenus = [
    {
      text: 'Device Configuration',
      translationtextKey: 'Device Configuration',
      icon: 'k-i-gear',
      id: 35,
      parentId: 20,
      path: 'main/tool/device-configuration',
    },
    {
      text: 'System Configuration',
      translationtextKey: 'System Configuration',
      icon: 'k-i-gears',
      id: 36,
      parentId: 20,
      path: 'main/tool/system-configuration',
    },
    {
      text: 'Company Info',
      translationtextKey: 'Company Info',
      icon: 'k-i-information',
      id: 21,
      parentId: 20,
      path: 'main/tool/company-info',
    },
    {
      text: 'Depreciation Engine',
      translationtextKey: 'Depreciation Engine',
      icon: 'k-i-form-element',
      id: 37,
      parentId: 20,
      path: 'main/tool/depreciation-engine',
    },
    {
      text: 'Barcode Structure',
      translationtextKey: 'Barcode Structure',
      icon: 'k-i-barcode-scanner',
      id: 38,
      parentId: 20,
      path: 'main/tool/barcode-structure',
    },
    // {
    //   text: "Offline Machines",
    //   icon: "k-i-invert-colors",
    //   id: 98,
    //   parentId: 20,gene
    //   path: 'main/tool/offline-machines'
    // },
    {
      text: 'Backend Inventory',
      translationtextKey: 'Backend Inventory',
      icon: 'k-i-parameters',
      id: 99,
      parentId: 20,
      path: 'main/tool/backend-inventory',
    },
  ];
  masterMenus = [
    {
      text: 'Designations',
      translationtextKey: 'Designations',
      icon: 'k-i-thumbnails-right',
      id: 6,
      parentId: 5,
      path: 'main/master-data/designations',
    },
    {
      text: 'Address Templates',
      translationtextKey: 'Address Templates',
      icon: 'k-i-grayscale',
      id: 7,
      parentId: 5,
      path: 'main/master-data/address-templates',
    },
    {
      text: 'Custodians',
      translationtextKey: 'Custodians',
      icon: 'k-i-accessibility',
      id: 8,
      parentId: 5,
      path: 'main/master-data/custodians',
    },
    {
      text: 'Brands',
      translationtextKey: 'Brands',
      icon: 'k-i-style-builder',
      id: 9,
      parentId: 5,
      path: 'main/master-data/brands',
    },
    {
      text: 'Insurers',
      translationtextKey: 'Insurers',
      icon: 'k-i-insert-bottom',
      id: 10,
      parentId: 5,
      path: 'main/master-data/insurers',
    },
    {
      text: 'Suppliers',
      translationtextKey: 'Suppliers',
      icon: 'k-i-overlap',
      id: 11,
      parentId: 5,
      path: 'main/master-data/suppliers',
    },
    {
      text: 'GL Codes',
      translationtextKey: 'GL Codes',
      icon: 'k-i-parameters-byte-array',
      id: 12,
      parentId: 5,
      path: 'main/master-data/gl-codes',
    },
    {
      text: 'Units',
      translationtextKey: 'Units',
      icon: 'k-i-layout-side-by-side',
      id: 13,
      parentId: 5,
      path: 'main/master-data/units',
    },
    {
      text: 'Disposal Methods',
      translationtextKey: 'Disposal Methods',
      icon: 'k-i-ungroup',
      id: 14,
      parentId: 5,
      path: 'main/master-data/disposal-methods',
    },
    {
      text: 'Depreciation Methods',
      translationtextKey: 'Depreciation Methods',
      icon: 'k-i-layout-1-by-4',
      id: 15,
      parentId: 5,
      path: 'main/master-data/depreciation-methods',
    },
    {
      text: 'Asset Items',
      translationtextKey: 'Asset Items',
      icon: 'k-i-data',
      id: 16,
      parentId: 5,
      path: 'main/master-data/asset-items',
    },
    {
      text: 'Assets Books',
      translationtextKey: 'Assets Books',
      icon: 'k-i-book',
      id: 17,
      parentId: 5,
      path: 'main/master-data/asset-book',
    },
    {
      text: 'Assets Categories',
      translationtextKey: 'Assets Categories',
      icon: 'k-i-align-items-center',
      id: 18,
      parentId: 5,
      path: 'main/master-data/assets-categories',
    },
    {
      text: 'Inventory Schedules',
      translationtextKey: 'Inventory Schedules',
      icon: 'k-i-invert-colors',
      id: 19,
      parentId: 5,
      path: 'main/master-data/inventory-schedules',
    },
    {
      text: 'Cost Centers',
      translationtextKey: 'Cost Centers',
      icon: 'k-i-currency',
      id: 26,
      parentId: 5,
      path: 'main/master-data/cost-centers',
    },
  ];
  SecurityMenus = [
    {
      text: 'Application Users',
      translationtextKey: 'Application Users',
      icon: 'k-i-user',
      id: 3,
      parentId: 2,
      path: 'main/security/application-users',
    },
    {
      text: 'User Roles',
      translationtextKey: 'User Roles',
      icon: 'k-i-bell',
      id: 4,
      parentId: 2,
      path: 'main/security/user-roles',
    },
    {
      text: 'Change Password',
      translationtextKey: 'Change Password',
      icon: 'k-i-lock',
      id: 24,
      parentId: 2,
      path: 'main/security/change-password',
    },
  ];
  poMenus = [
    {
      text: 'PO Preparation',
      translationtextKey: 'PO Preparation',
      icon: 'k-i-track-changes',
      id: 32,
      parentId: 25,
      path: 'main/purchase-order/po-preparation',
    },
    {
      text: 'PO Approvals',
      translationtextKey: 'PO Approvals',
      icon: 'k-i-track-changes-accept',
      id: 33,
      parentId: 25,
      path: 'main/purchase-order/po-approvals',
    },
    {
      text: 'Assets In Transit',
      translationtextKey: 'Assets In Transit',
      icon: 'k-i-arrows-dimensions',
      id: 34,
      parentId: 25,
      path: 'main/purchase-order/assets-in-transit',
    },
  ];
  communicationMenus = [
    // {
    //   text: "Data Acquisition",
    //   translationtextKey: "Data Acquisition",
    //   icon: "k-i-file-data",
    //   id: 41,
    //   parentId: 39,
    //   path: 'main/communication/data-acquisition'
    // },
    // {
    //   text: "Data Transfer",
    //   translationtextKey: "Data Transfer",
    //   icon: "k-i-arrow-root",
    //   id: 42,
    //   parentId: 39,
    //   path: 'main/communication/data-transfer'
    // },
    {
      text: 'Data Processing',
      translationtextKey: 'Data Processing',
      icon: 'k-i-arrow-root',
      id: 142,
      parentId: 39,
      path: 'main/communication/data-processing',
    },
  ];
  assetMenus = [
    {
      text: 'Search',
      translationtextKey: 'Search',
      icon: 'k-i-zoom',
      id: 43,
      parentId: 40,
      path: 'main/asset/search',
    },
    {
      text: 'Details & Maintenance',
      translationtextKey: 'Details & Maintenance',
      icon: 'k-i-window',
      id: 44,
      parentId: 40,
      path: 'main/asset/details-maintenance',
    },
    // {
    //   text: "Anonymous Assets",
    //   icon: "k-i-radiobutton-checked",
    //   id: 45,
    //   parentId: 40,
    //   path: 'main/asset/anonymous-assets'
    // },
    {
      text: 'Location/Custody Transfer',
      translationtextKey: 'Location/Custody Transfer',
      icon: 'k-i-hyperlink-open-sm',
      id: 46,
      parentId: 40,
      path: 'main/asset/location-custody-transfer',
    },
    {
      text: 'Inter Company Transfer',
      translationtextKey: 'Inter Company Transfer',
      icon: 'k-i-login',
      id: 47,
      parentId: 40,
      path: 'main/asset/inter-company-transfer',
    },
    {
      text: 'Warranty Alarm',
      translationtextKey: 'Warranty Alarm',
      icon: 'k-i-notification',
      id: 48,
      parentId: 40,
      path: 'main/asset/warranty-alarm',
    },
    {
      text: 'Administration',
      icon: 'k-i-style-builder',
      translationtextKey: 'Administration',
      id: 49,
      parentId: 40,
      path: 'main/asset/administration',
    },
  ];
  reportingMenus = [
    {
      text: 'Standard Reports',
      translationtextKey: 'Standard Reports',
      icon: 'k-i-subreport',
      id: 50,
      parentId: 59,
      path: 'main/reporting/standard-reports',
    },
    {
      text: 'Audit Status Reports',
      translationtextKey: 'Audit Status Reports',
      icon: 'k-i-report-header-section',
      id: 51,
      parentId: 59,
      path: 'main/reporting/audit-status-reports',
    },
  ];

  public items: Array<any> = [];

  // = [
  //   this.mainMenus,
  //   this.SecurityMenus,
  //   this.masterMenus,
  //   this.toolsMenus,
  //   this.companyProfileMenus
  // ];

  itemRoute: any = [];
  user: any;
  roleAssignOptions: any;
  menus: any[];
  getMenu() {
    let userDetail: any = localStorage.getItem('userDetail');
    userDetail = JSON.parse(userDetail);
    this.authService.getMenu({ roleId: 1 }).subscribe(
      (res: any) => {
        if (res) {
          this.items = [];
          this.itemRoute = [];
          res.map((item: any) => {
            let value;
            if (item.parentMenuId != 0) {
              value = {
                text: item.menuName,
                icon: item.iconClass,
                selected: item.menuName == 'Dashboard' ? true : false,
                id: item.menuId1,
                parentId: item.parentMenuId,
                path: item.menuUrl,
              };
            } else {
              value = {
                text: item.menuName,
                icon: item.iconClass,
                id: item.menuId1,
              };
            }
            this.itemRoute.push(value);
          });
          this.items = this.itemRoute;
          console.log(this.items);
          localStorage.setItem('menu', JSON.stringify(res));
        }
      },
      (err) => {
        this.toast.show(err.message, 'error');
      }
    );
  }

  screenWidth!: number;
  isDrawerExpanded: Boolean = this.expanded;

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 767) {
      this.mode = 'overlay';
    } else {
      this.mode = 'push';
    }
  }

  public show = false;

  public onToggle(): void {
    this.show = !this.show;
  }

  constructor(
    private route: Router,
    private router: Router,
    private toast: toastService,
    private authService: AuthService,
    private tokenService: TokenStorageService,
    public translateService: TranslateService,
    private spy: ChangeDetectorRef,
    private messages: MessageService,
    public generalService: GeneralService,
    private activatedRoute: ActivatedRoute,
    private dataService: TableDataService
  ) {
    // translateService.addLangs(['en', 'ar']);
    // translateService.setDefaultLang('en');
    // const browserLang = translateService.getBrowserLang();
    // translateService.use(browserLang.match(/en|ar/) ? browserLang : 'en');
    // this.items = this.items.map((item) => item.text)
    //  this.translateService.get(this.items);
    // const currentLang = translateService.currentLang;
    // translateService.currentLang = '';
    // translateService.use(currentLang);
    // this.translateService.instant(this.items);
    // this.translateService.get('Dashboard').subscribe((translated: string) => {
    // console.log(translated);
    //=> 'Hello world'
    // You can call instant() here
    // const translation = this.translateService.instant(tbk);
    //=> 'Something else'
    // });
  }

  ngOnInit(): void {
    // this.generalService.getRoleRightsByID();
    this.getRoleRightsByID();
    this.user = JSON.parse(this.tokenService.getUserObj()!);
    this.activatedRoute.url.subscribe((res) => {
      if (this.mode === 'overlay') {
        this.drawer.toggle();
      }
    });
    this.onResize();
    // this.items = this.items
    //   .concat(this.mainMenus)
    //   .concat(this.toolsMenus)
    //   .concat(this.masterMenus)
    //   .concat(this.SecurityMenus)
    //   .concat(this.dashboardMenus)
    //   .concat(this.companyProfileMenus)
    //   .concat(this.poMenus)
    //   .concat(this.communicationMenus)
    //   .concat(this.assetMenus)
    //   .concat(this.reportingMenus)
    //   .concat(this.fileMenus);
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.changeLangage(lang);

    }else{
      this.changeLangage('en');
    }


    //   this.generalService.afterLoginLTR.pipe(
    //     takeUntil(this.unsubscribe)
    // ).subscribe((res) => {
    //   console.log(res,'language fetched from lgo')
    //     this.changeLangage(res);
    // });
    // this.getMenu()
    // this.translateService.instant(text)
  }

  // onSelect(e:any) {
  //   console.log(e)
  // }

  // public get textToTranslate() : string {
  //   return this.items[0].text;
  // }
  public changeLangage(lang: string) {
    if (lang == 'ar') {
      this.rtl = false;
      const body = document.querySelector('body[dir]') as HTMLBodyElement;
      body.dir = body.dir === 'rtl' ? 'rtl' : 'rtl';
      this.spy.detectChanges();
      this.rtl = !this.rtl;
      this.messages.notify(this.rtl);
      localStorage.setItem('lang', lang);
    } else {
      this.rtl = true;
      const body = document.querySelector('body[dir]') as HTMLBodyElement;
      body.dir = body.dir === 'ltr' ? 'ltr' : 'ltr';
      this.spy.detectChanges();
      this.rtl = !this.rtl;
      this.messages.notify(this.rtl);
      localStorage.setItem('lang', lang);
    }

    // this.rtl = !this.rtl;
    // this.messages.notify(this.rtl);
    // const body = document.querySelector('body[dir]') as HTMLBodyElement;
    //     body.dir = body.dir === 'rtl' ? 'ltr' : 'rtl';
    //     this.spy.detectChanges();
    //     var menU = this.items.map((item) => item.text)
    // console.log(menU[0],'this is the new menu')

    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);

    setTimeout(() => {
      for (var i = 0; i <= this.items.length; i++) {
        if (this.items[i]?.translationtextKey) {
          this.translateService
            .get(this.items[i]?.translationtextKey)
            .subscribe((text: string) => {
              this.items[i].text = text;
              // console.log(text, 'this is the response');
            });
        }
      }
    }, 200);
  }

  logout() {
    this.router.navigate(['/authentication/sign-in']);
    this.tokenService.deleteLoginData();
    this.toast.show('Logout Successfully', 'success');
  }

  // Collection with the indices of all expanded items
  public expandedIndices = [0];

  // Predicate function, which determines if an item is expanded
  public isItemExpanded = (item: any): boolean => {
    return this.expandedIndices.indexOf(item.id) >= 0;
  };

  public onSelect(ev: DrawerSelectEvent): void {
    console.log(ev);
    if (ev.item.path) this.route.navigate([ev.item.path]);
    this.selected = ev.item.text;
    const current = ev.item.id;

    if (this.expandedIndices.indexOf(current) >= 0) {
      this.expandedIndices = this.expandedIndices.filter(
        (id) => id !== current
      );
    } else {
      this.expandedIndices.push(current);
    }
  }

  isExpanded(ev: boolean) {
    this.isDrawerExpanded = ev;
  }

  getRoleRightsByID() {
      this.dataService.getTableDataWithPagination('Roles/GetRoleByID', { get: 1, getByID: 1, roleID: (JSON.parse(localStorage.getItem('userObj') || 'null').roleID)})
        .pipe(
          first())
        .subscribe({
          next: (res: any) => {
            this.roleAssignOptions = res?.roleAssignOptions;
            this.menus = this.buildMenuList(res?.masterMenu, res?.menuOptions);
            // console.log('this.menu data',this.menus);
            this.items = this.menus;

          }
        })
        // return this.setPermissions(this.menus)
      }


  buildMenuList(masterMenu: any[], menuOptions: any[]): any[] {
    const menuMap: { [key: number]: any } = {};

    // Create initial map for menus
    masterMenu.forEach((menu) => {
      menuMap[menu.menuID] = {
        id: menu.menuID,
        text: menu.menuName,
        translationtextKey: menu.menuName,
        selected: menu.menuName == 'Dashboard' ? true : false,
        icon: menu.icon ?  menu.icon.substring(0, menu.icon.indexOf(' ')): '',
        path: menu.url ? 'main'+menu.url : '',
        parentId: menu.parentId,
        options: [],
      };
    });

    // Add options to corresponding menus
    menuOptions.forEach((option) => {
      if (menuMap[option.menuID]) {
        menuMap[option.menuID].options.push({
          id: option.optionID,
          text: option.optionName,
          checked: !!this.roleAssignOptions.find(
            (assign: any) =>
              assign.menuId === option.menuID &&
              assign.optionId === option.optionID &&
              assign.value === 1
          ),
        });
      }
    });

  // Filter out menus where "View" option is not true
  return Object.values(menuMap).filter((menu) =>
    menu.options.some((option: any) => option.text === 'View' && option.checked)
  );
    // Return a flat list with hierarchical information
    // return Object.values(menuMap);
  }
}
