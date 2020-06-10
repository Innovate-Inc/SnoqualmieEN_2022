import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapViewComponent} from './map-view/map-view.component';
import {IdentityManagementService} from './services/identity-management.service';
import {ListViewComponent} from './list-view/list-view.component';


const routes: Routes = [
  {
    path: '', component: MapViewComponent, canActivate: [IdentityManagementService], children: [
      {path: 'projects', component: ListViewComponent},
      {path: '', redirectTo: 'projects', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
