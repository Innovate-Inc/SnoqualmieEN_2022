import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitTabComponent } from './site-visit-tab.component';

describe('SiteVisitTabComponent', () => {
  let component: SiteVisitTabComponent;
  let fixture: ComponentFixture<SiteVisitTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteVisitTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteVisitTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
