import { TestBed } from '@angular/core/testing';

import { HolidayMaster } from './holiday-master';

describe('HolidayMaster', () => {
  let service: HolidayMaster;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HolidayMaster);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
