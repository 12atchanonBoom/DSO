import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { EditTextComponent } from './pages/edit-text/edit-text.component';
import { EditSymbolComponent } from './pages/edit-symbol/edit-symbol.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { NavbarComponent } from './pages/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DashboardComponent,
    SidebarComponent,
    EditTextComponent,
    EditSymbolComponent,
    EditUserComponent,
    DashboardHomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // ✅ แทน RouterModule
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
