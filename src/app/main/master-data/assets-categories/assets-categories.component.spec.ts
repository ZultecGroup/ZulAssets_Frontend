import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsCategoriesComponent } from './assets-categories.component';

describe('AssetsCategoriesComponent', () => {
  let component: AssetsCategoriesComponent;
  let fixture: ComponentFixture<AssetsCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
