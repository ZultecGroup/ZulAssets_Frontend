import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAssetsCodingDefinitionComponent } from './add-update-assets-coding-definition.component';

describe('AddUpdateAssetsCodingDefinitionComponent', () => {
  let component: AddUpdateAssetsCodingDefinitionComponent;
  let fixture: ComponentFixture<AddUpdateAssetsCodingDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAssetsCodingDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAssetsCodingDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
