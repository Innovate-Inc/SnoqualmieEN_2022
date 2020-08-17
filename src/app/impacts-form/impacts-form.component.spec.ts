import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactsFormComponent } from './impacts-form.component';

describe('ImpactsFormComponent', () => {
  let component: ImpactsFormComponent;
  let fixture: ComponentFixture<ImpactsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpactsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
