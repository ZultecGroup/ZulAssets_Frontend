import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsDescriptionComponent } from './assets-description.component';

describe('AssetsDescriptionComponent', () => {
  let component: AssetsDescriptionComponent;
  let fixture: ComponentFixture<AssetsDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetsDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
