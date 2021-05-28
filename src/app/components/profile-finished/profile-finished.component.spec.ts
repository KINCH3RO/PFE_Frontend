import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFinishedComponent } from './profile-finished.component';

describe('ProfileFinishedComponent', () => {
  let component: ProfileFinishedComponent;
  let fixture: ComponentFixture<ProfileFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileFinishedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
