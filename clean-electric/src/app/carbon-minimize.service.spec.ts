import { TestBed } from '@angular/core/testing';

import { CarbonMinimizeService } from './carbon-minimize.service';

describe('CarbonMinimizeService', () => {
  let service: CarbonMinimizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonMinimizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
