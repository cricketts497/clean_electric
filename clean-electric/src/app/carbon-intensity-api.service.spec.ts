import { TestBed } from '@angular/core/testing';

import { CarbonIntensityApiService } from './carbon-intensity-api.service';

describe('CarbonIntensityApiService', () => {
  let service: CarbonIntensityApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarbonIntensityApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
