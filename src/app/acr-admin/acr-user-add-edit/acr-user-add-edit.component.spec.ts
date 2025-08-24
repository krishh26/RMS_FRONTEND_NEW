import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrUserAddEditComponent } from './acr-user-add-edit.component';

describe('AcrUserAddEditComponent', () => {
  let component: AcrUserAddEditComponent;
  let fixture: ComponentFixture<AcrUserAddEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcrUserAddEditComponent]
    });
    fixture = TestBed.createComponent(AcrUserAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
