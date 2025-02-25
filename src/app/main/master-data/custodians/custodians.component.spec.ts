import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodiansComponent } from './custodians.component';

describe('CustodiansComponent', () => {
  let component: CustodiansComponent;
  let fixture: ComponentFixture<CustodiansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodiansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustodiansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
