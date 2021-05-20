import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { ManageAccountsComponent } from './components/manage-accounts/manage-accounts.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './components/alert/alert.component'

import { EventemitterService } from './services/eventemitter.service';
import { RoleSettingsComponent } from './components/role-settings/role-settings.component';
import { ProfileCreationStepsComponent } from './components/profile-creation-steps/profile-creation-steps.component';
import { ProfileBasicInfoComponent } from './components/profile-basic-info/profile-basic-info.component';
import { ProfileCreationWizardComponent } from './components/profile-creation-wizard/profile-creation-wizard.component';
import { ProfileProfInfoComponent } from './components/profile-prof-info/profile-prof-info.component';
import { SelectComponent } from './components/select/select.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    UserAccountComponent,
    AdminPanelComponent,
    AdminSidebarComponent,
    ManageAccountsComponent,
    AlertComponent,
    RoleSettingsComponent,
    ProfileCreationStepsComponent,
    ProfileBasicInfoComponent,
    ProfileCreationWizardComponent,
    ProfileProfInfoComponent,
    SelectComponent,
    
  


  ],
  imports: [

    BrowserModule,

    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule


  ],
  providers: [FormBuilder,EventemitterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
