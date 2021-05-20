import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCreationStepsComponent } from './profile-creation-steps.component';

describe('ProfileCreationStepsComponent', () => {
  let component: ProfileCreationStepsComponent;
  let fixture: ComponentFixture<ProfileCreationStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCreationStepsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCreationStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
