import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDocsFormComponent } from './support-docs-form.component';

describe('SupportDocsFormComponent', () => {
  let component: SupportDocsFormComponent;
  let fixture: ComponentFixture<SupportDocsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportDocsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDocsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
