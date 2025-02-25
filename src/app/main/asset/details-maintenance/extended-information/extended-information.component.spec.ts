import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedInformationComponent } from './extended-information.component';

describe('ExtendedInformationComponent', () => {
  let component: ExtendedInformationComponent;
  let fixture: ComponentFixture<ExtendedInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendedInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
