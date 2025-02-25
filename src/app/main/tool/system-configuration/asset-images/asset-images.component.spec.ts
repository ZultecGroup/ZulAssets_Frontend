import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetImagesComponent } from './asset-images.component';

describe('AssetImagesComponent', () => {
  let component: AssetImagesComponent;
  let fixture: ComponentFixture<AssetImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
