import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallTabComponent } from './call-tab.component';

describe('CallTabComponent', () => {
  let component: CallTabComponent;
  let fixture: ComponentFixture<CallTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
