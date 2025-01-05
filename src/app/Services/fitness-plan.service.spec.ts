import { TestBed } from '@angular/core/testing';

import { FitnessPlanService } from './fitness-plan.service';

describe('FitnessPlanService', () => {
  let service: FitnessPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitnessPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
