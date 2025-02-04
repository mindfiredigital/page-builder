import { TestBed } from '@angular/core/testing';

import { PageBuilderAngularService } from './page-builder-angular.service';

describe('PageBuilderAngularService', () => {
  let service: PageBuilderAngularService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageBuilderAngularService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
