import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposalOrSalesInformationComponent } from './disposal-or-sales-information.component';

describe('DisposalOrSalesInformationComponent', () => {
  let component: DisposalOrSalesInformationComponent;
  let fixture: ComponentFixture<DisposalOrSalesInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisposalOrSalesInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposalOrSalesInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
