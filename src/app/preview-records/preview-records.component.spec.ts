import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewRecordsComponent } from './preview-records.component';

describe('PreviewRecordsComponent', () => {
  let component: PreviewRecordsComponent;
  let fixture: ComponentFixture<PreviewRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
