import { TestBed } from '@angular/core/testing';

import { CsvFetchService } from './csv-fetch.service';

describe('CsvFetchService', () => {
  let service: CsvFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
