import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateCostCentersComponent } from 'src/app/main/master-data/cost-centers/add-update-cost-centers/add-update-cost-centers.component';



describe('AddUpdateCostCentersComponent', () => {
  let component: AddUpdateCostCentersComponent;
  let fixture: ComponentFixture<AddUpdateCostCentersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateCostCentersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateCostCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
