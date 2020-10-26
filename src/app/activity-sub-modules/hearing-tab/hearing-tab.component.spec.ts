import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingTabComponent } from './hearing-tab.component';

describe('HearingTabComponent', () => {
  let component: HearingTabComponent;
  let fixture: ComponentFixture<HearingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
