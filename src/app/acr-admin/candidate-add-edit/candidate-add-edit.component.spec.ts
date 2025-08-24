import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAddEditComponent } from './candidate-add-edit.component';

describe('CandidateAddEditComponent', () => {
  let component: CandidateAddEditComponent;
  let fixture: ComponentFixture<CandidateAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateAddEditComponent]
    });
    fixture = TestBed.createComponent(CandidateAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
