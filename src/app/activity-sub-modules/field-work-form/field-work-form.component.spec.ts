import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWorkFormComponent } from './field-work-form.component';

describe('FieldWorkFormComponent', () => {
  let component: FieldWorkFormComponent;
  let fixture: ComponentFixture<FieldWorkFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldWorkFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldWorkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
