import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { EditTextComponent } from './pages/edit-text/edit-text.component';
import { EditSymbolComponent } from './pages/edit-symbol/edit-symbol.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';
import { CheckComponent } from './pages/check/check.component';
import { CheckHistoryComponent } from './pages/check-history/check-history.component';
import { HistoryDetailsComponent } from './pages/history-details/history-details.component'; // <== เพิ่ม import

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'check', component: CheckComponent },
  { path: 'check-history', component: CheckHistoryComponent },
  { path: 'history-details/:id', component: HistoryDetailsComponent }, // <== เพิ่มบรรทัดนี้
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
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
