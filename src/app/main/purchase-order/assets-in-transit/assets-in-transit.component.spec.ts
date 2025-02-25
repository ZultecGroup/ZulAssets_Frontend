import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssitsInTransitComponent } from './assets-in-transit.component';

describe('GeneratePoAssetsComponent', () => {
  let component: AssitsInTransitComponent;
  let fixture: ComponentFixture<AssitsInTransitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssitsInTransitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssitsInTransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
