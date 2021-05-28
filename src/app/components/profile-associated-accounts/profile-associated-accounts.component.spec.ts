import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAssociatedAccountsComponent } from './profile-associated-accounts.component';

describe('ProfileAssociatedAccountsComponent', () => {
  let component: ProfileAssociatedAccountsComponent;
  let fixture: ComponentFixture<ProfileAssociatedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileAssociatedAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAssociatedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
