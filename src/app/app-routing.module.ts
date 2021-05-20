import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ManageAccountsComponent } from './components/manage-accounts/manage-accounts.component';
import { ProfileBasicInfoComponent } from './components/profile-basic-info/profile-basic-info.component';
import { ProfileCreationStepsComponent } from './components/profile-creation-steps/profile-creation-steps.component';
import { ProfileCreationWizardComponent } from './components/profile-creation-wizard/profile-creation-wizard.component';
import { ProfileProfInfoComponent } from './components/profile-prof-info/profile-prof-info.component';
import { RoleSettingsComponent } from './components/role-settings/role-settings.component';
import { UserAccountComponent } from './components/user-account/user-account.component';

import { LoggedInGuard } from './guards/logged-in.guard';


const routes: Routes = [
  { path: 'home', component: HomeComponent },

  {
    path: 'login', canActivate: [LoggedInGuard], children: [
      { path: '', component: LoginComponent, },
      { path: ':formName', component: LoginComponent },
    ]
  },
  {
    path: 'user', children: [
      { path: '', component: UserAccountComponent },
      { path: ':id', component: UserAccountComponent },
    ]
  },

  {
    path: 'panel',component: AdminPanelComponent, children: [
      { path: 'accounts', component: ManageAccountsComponent, },
      { path: 'roles', component: RoleSettingsComponent },
    ]
  },
  {
    path: 'profileCreation',component: ProfileCreationWizardComponent, children: [
      { path: '', component: ProfileBasicInfoComponent },
      { path: 'pro', component: ProfileProfInfoComponent }
     
    ]
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }