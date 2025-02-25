import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodianHistoryComponent } from './custodian-history.component';

describe('CustodianHistoryComponent', () => {
  let component: CustodianHistoryComponent;
  let fixture: ComponentFixture<CustodianHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodianHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustodianHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
