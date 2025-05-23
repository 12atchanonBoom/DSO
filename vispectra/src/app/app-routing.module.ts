import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditTextComponent } from './pages/edit-text/edit-text.component';
import { EditSymbolComponent } from './pages/edit-symbol/edit-symbol.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // ✅ redirect หน้าเริ่มต้น
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'edit-text', component: EditTextComponent },
      { path: 'edit-symbol', component: EditSymbolComponent },
      { path: 'edit-user', component: EditUserComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
