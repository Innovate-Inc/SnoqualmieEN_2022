import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './map-view/map-view.component';
import { IdentityManagementService } from './services/identity-management.service';
import { ListViewComponent } from './list-view/list-view.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {EditPaneComponent} from './edit-pane/edit-pane.component';




const routes: Routes = [
  {
    path: 'app', component: MapViewComponent, canActivate: [IdentityManagementService], children: [
      {
        path: 'edit/:id', component: EditPaneComponent, children: [
          {path: '', redirectTo: 'project', pathMatch: 'full'},
        ]
      },
      { path: 'projects', component: ListViewComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  },
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
