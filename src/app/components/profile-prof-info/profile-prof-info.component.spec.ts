import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProfInfoComponent } from './profile-prof-info.component';

describe('ProfileProfInfoComponent', () => {
  let component: ProfileProfInfoComponent;
  let fixture: ComponentFixture<ProfileProfInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileProfInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProfInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
