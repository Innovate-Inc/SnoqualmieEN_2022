import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitFormComponent } from './site-visit-form.component';

describe('SiteVisitFormComponent', () => {
  let component: SiteVisitFormComponent;
  let fixture: ComponentFixture<SiteVisitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteVisitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
