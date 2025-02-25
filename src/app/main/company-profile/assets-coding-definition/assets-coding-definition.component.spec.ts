import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsCodingDefinitionComponent } from './assets-coding-definition.component';

describe('AssetsCodingDefinitionComponent', () => {
  let component: AssetsCodingDefinitionComponent;
  let fixture: ComponentFixture<AssetsCodingDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsCodingDefinitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsCodingDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
