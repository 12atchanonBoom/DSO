import { TestBed } from '@angular/core/testing';

import { VispectraService } from './vispectra.service';

describe('VispectraService', () => {
  let service: VispectraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VispectraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
