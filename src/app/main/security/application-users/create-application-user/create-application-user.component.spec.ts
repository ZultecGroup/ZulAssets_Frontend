import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApplicationUserComponent } from './create-application-user.component';

describe('CreateApplicationUserComponent', () => {
  let component: CreateApplicationUserComponent;
  let fixture: ComponentFixture<CreateApplicationUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateApplicationUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApplicationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
