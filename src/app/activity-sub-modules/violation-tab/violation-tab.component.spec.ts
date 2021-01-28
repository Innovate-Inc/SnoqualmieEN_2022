import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationTabComponent } from './violation-tab.component';

describe('ViolationTabComponent', () => {
  let component: ViolationTabComponent;
  let fixture: ComponentFixture<ViolationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolationTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
