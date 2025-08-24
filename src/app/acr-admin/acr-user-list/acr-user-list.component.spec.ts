import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrUserListComponent } from './acr-user-list.component';

describe('AcrUserListComponent', () => {
  let component: AcrUserListComponent;
  let fixture: ComponentFixture<AcrUserListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcrUserListComponent]
    });
    fixture = TestBed.createComponent(AcrUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
