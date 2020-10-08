import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingFormComponent } from './hearing-form.component';

describe('HearingFormComponent', () => {
  let component: HearingFormComponent;
  let fixture: ComponentFixture<HearingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HearingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
