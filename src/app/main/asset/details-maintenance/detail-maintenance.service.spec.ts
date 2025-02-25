import { TestBed } from '@angular/core/testing';

import { DetailMaintenanceService } from './detail-maintenance.service';

describe('DetailMaintenanceService', () => {
  let service: DetailMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
