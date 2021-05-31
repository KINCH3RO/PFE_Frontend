import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubCatComponent } from './manage-sub-cat.component';

describe('ManageSubCatComponent', () => {
  let component: ManageSubCatComponent;
  let fixture: ComponentFixture<ManageSubCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSubCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
