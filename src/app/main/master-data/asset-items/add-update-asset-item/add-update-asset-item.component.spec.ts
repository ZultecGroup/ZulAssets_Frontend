import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAssetItemComponent } from './add-update-asset-item.component';

describe('AddUpdateAssetItemComponent', () => {
  let component: AddUpdateAssetItemComponent;
  let fixture: ComponentFixture<AddUpdateAssetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAssetItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAssetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
