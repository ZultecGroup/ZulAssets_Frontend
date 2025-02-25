import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetItemsComponent } from './asset-items.component';

describe('AssetItemsComponent', () => {
  let component: AssetItemsComponent;
  let fixture: ComponentFixture<AssetItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
