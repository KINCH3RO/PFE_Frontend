import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCreationWizardComponent } from './profile-creation-wizard.component';

describe('ProfileCreationWizardComponent', () => {
  let component: ProfileCreationWizardComponent;
  let fixture: ComponentFixture<ProfileCreationWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCreationWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCreationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
