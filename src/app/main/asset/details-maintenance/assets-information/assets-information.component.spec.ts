import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsInformationComponent } from './assets-information.component';

describe('AssetsInformationComponent', () => {
  let component: AssetsInformationComponent;
  let fixture: ComponentFixture<AssetsInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
