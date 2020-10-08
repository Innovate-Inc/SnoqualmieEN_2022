import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanceEncounterFormComponent } from './chance-encounter-form.component';

describe('ChanceEncounterFormComponent', () => {
  let component: ChanceEncounterFormComponent;
  let fixture: ComponentFixture<ChanceEncounterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanceEncounterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanceEncounterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
