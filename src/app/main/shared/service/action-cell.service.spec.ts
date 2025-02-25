import { TestBed } from '@angular/core/testing';

import { ActionCellService } from './action-cell.service';

describe('ActionCellService', () => {
  let service: ActionCellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionCellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
