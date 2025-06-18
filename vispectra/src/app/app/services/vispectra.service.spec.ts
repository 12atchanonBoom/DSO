// 📁 src/app/services/vispectra.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { VispectraService } from './vispectra.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VispectraService', () => {
  let service: VispectraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VispectraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
