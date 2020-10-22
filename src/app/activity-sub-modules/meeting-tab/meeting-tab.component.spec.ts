import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingTabComponent } from './meeting-tab.component';

describe('MeetingTabComponent', () => {
  let component: MeetingTabComponent;
  let fixture: ComponentFixture<MeetingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
