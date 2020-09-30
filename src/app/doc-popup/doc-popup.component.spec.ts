import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocPopupComponent } from './doc-popup.component';

describe('DocPopupComponent', () => {
  let component: DocPopupComponent;
  let fixture: ComponentFixture<DocPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
