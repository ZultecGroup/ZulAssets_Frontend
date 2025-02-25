import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBooksComponent } from './asset-books.component';

describe('AssetBooksComponent', () => {
  let component: AssetBooksComponent;
  let fixture: ComponentFixture<AssetBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetBooksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
