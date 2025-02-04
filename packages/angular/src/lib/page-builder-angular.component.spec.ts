import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBuilderAngularComponent } from './page-builder-angular.component';

describe('PageBuilderAngularComponent', () => {
  let component: PageBuilderAngularComponent;
  let fixture: ComponentFixture<PageBuilderAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageBuilderAngularComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageBuilderAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
