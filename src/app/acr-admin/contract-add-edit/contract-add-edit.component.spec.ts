import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractAddEditComponent } from './contract-add-edit.component';

describe('ContractAddEditComponent', () => {
  let component: ContractAddEditComponent;
  let fixture: ComponentFixture<ContractAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractAddEditComponent]
    });
    fixture = TestBed.createComponent(ContractAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
