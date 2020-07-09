import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonExemptComponent } from './non-exempt.component';

describe('NonExemptComponent', () => {
  let component: NonExemptComponent;
  let fixture: ComponentFixture<NonExemptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonExemptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonExemptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
