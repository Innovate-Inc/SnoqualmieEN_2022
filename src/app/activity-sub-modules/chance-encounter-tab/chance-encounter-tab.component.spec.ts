import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanceEncounterTabComponent } from './chance-encounter-tab.component';

describe('ChanceEncounterTabComponent', () => {
  let component: ChanceEncounterTabComponent;
  let fixture: ComponentFixture<ChanceEncounterTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChanceEncounterTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChanceEncounterTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
