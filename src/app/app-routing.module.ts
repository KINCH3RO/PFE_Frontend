import { findReadVarNames } from '@angular/compiler/src/output/output_ast';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ManageAccountsComponent } from './components/manage-accounts/manage-accounts.component';
import { ManageCategoriesComponent } from './components/manage-categories/manage-categories.component';
import { ManageSubCatComponent } from './components/manage-sub-cat/manage-sub-cat.component';
import { ProfileAssociatedAccountsComponent } from './components/profile-associated-accounts/profile-associated-accounts.component';
import { ProfileBasicInfoComponent } from './components/profile-basic-info/profile-basic-info.component';
import { ProfileCreationStepsComponent } from './components/profile-creation-steps/profile-creation-steps.component';
import { ProfileCreationWizardComponent } from './components/profile-creation-wizard/profile-creation-wizard.component';
import { ProfileFinishedComponent } from './components/profile-finished/profile-finished.component';
import { ProfileProfInfoComponent } from './components/profile-prof-info/profile-prof-info.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RoleSettingsComponent } from './components/role-settings/role-settings.component';
import { BasicInfoPageComponent } from './components/services/basic-info-page/basic-info-page.component';
import { EditServiceComponent } from './components/services/edit-service/edit-service.component';
import { FinishPageComponent } from './components/services/finish-page/finish-page.component';
import { MediaInfoPageComponent } from './components/services/media-info-page/media-info-page.component';
import { MyServicesComponent } from './components/services/my-services/my-services.component';
import { PlansInfoPageComponent } from './components/services/plans-info-page/plans-info-page.component';
import { ServicePageComponent } from './components/services/service-page/service-page.component';
import { StepsPageComponent } from './components/services/steps-page/steps-page.component';
import { UserAccountComponent } from './components/user-account/user-account.component';

import { LoggedInGuard } from './guards/logged-in.guard';
import { SearchPageComponent } from './components/services/search-page/search-page.component';
import { ManageIrlCatComponent } from './components/manage-irl-cat/manage-irl-cat.component';
import { ServicesMapComponent } from './components/services/services-map/services-map.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'profile', children: [

      { path: '', component: ProfileComponent },
      { path: ':id', component: ProfileComponent }
    ]
  },

  {
    path: 'editProfile', component: EditProfileComponent, children: [
      { path: ':id', component: ProfileComponent }
    ]
  },

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
    path: 'panel', component: AdminPanelComponent, children: [
      { path: 'accounts', component: ManageAccountsComponent, },
      { path: 'roles', component: RoleSettingsComponent },
      { path: 'categories', component: ManageCategoriesComponent },
      { path: 'irlCategories', component: ManageIrlCatComponent },
      { path: 'subCats/:id', component: ManageSubCatComponent }
    ]
  },
  {
    path: "CreationSteps", component: ProfileCreationStepsComponent
  },
  {
    path: 'profileCreation', component: ProfileCreationWizardComponent, children: [

      { path: '', component: ProfileBasicInfoComponent },

      { path: 'pro', component: ProfileProfInfoComponent },
      { path: 'Aac', component: ProfileAssociatedAccountsComponent },
      { path: 'finished', component: ProfileFinishedComponent }

    ]
  },

  {
    path: 'serviceCreation', component: StepsPageComponent, children: [


      { path: 'basic', component: BasicInfoPageComponent },
      { path: 'plans', component: PlansInfoPageComponent },
      { path: 'media', component: MediaInfoPageComponent },
      { path: 'finish', component: FinishPageComponent },


    ]
  },
  { path: 'myServices', component: MyServicesComponent },
  { path: 'editService/:id', component: EditServiceComponent },
  { path: 'service/:id', component: ServicePageComponent },
  { path: 'services', component: SearchPageComponent },
  { path: 'mapSearch', component: ServicesMapComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }