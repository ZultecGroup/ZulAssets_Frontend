import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousAssetsComponent } from './anonymous-assets.component';

describe('AnonymousAssetsComponent', () => {
  let component: AnonymousAssetsComponent;
  let fixture: ComponentFixture<AnonymousAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnonymousAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
