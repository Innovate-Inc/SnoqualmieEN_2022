import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationFormComponent } from './violation-form.component';

describe('ViolationFormComponent', () => {
  let component: ViolationFormComponent;
  let fixture: ComponentFixture<ViolationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
