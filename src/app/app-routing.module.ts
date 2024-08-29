import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PersonDetailsComponent } from './components/person-details/person-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'home' ,pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'characters/:id', component: PersonDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
