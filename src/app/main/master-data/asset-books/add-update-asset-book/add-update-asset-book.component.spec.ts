import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAssetBookComponent } from './add-update-asset-book.component';

describe('AddUpdateAssetBookComponent', () => {
  let component: AddUpdateAssetBookComponent;
  let fixture: ComponentFixture<AddUpdateAssetBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAssetBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAssetBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
