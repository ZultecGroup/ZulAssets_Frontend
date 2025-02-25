import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterCompanyTransferComponent } from './inter-company-transfer.component';

describe('InterCompanyTransferComponent', () => {
  let component: InterCompanyTransferComponent;
  let fixture: ComponentFixture<InterCompanyTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterCompanyTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterCompanyTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
