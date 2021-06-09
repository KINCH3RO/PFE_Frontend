import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageIrlCatComponent } from './manage-irl-cat.component';

describe('ManageIrlCatComponent', () => {
  let component: ManageIrlCatComponent;
  let fixture: ComponentFixture<ManageIrlCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageIrlCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageIrlCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
