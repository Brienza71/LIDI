import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CreateComponent } from './components/create/create.component';
import { HomeTeamComponent } from './components/home-team/home-team.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';

const routes: Routes = [
  { path: 'home', pathMatch: 'full', component: HomeComponent },
  { path: 'homeTeam', pathMatch: 'full', component: HomeTeamComponent },
  { path: 'create', pathMatch: 'full', component: CreateComponent },
  { path: 'createTeam', pathMatch: 'full', component: CreateTeamComponent },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
