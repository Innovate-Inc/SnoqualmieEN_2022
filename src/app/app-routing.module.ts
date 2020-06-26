// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// import { IdentityManagementService } from './services/identity-management.service';

// import { MapViewComponent } from './map-view/map-view.component';
// import { ListViewComponent } from './list-view/list-view.component';
// import { InvoiceComponent } from './invoice/invoice.component';

// const routes: Routes = [
//   {
//     path: '', component: MapViewComponent, canActivate: [IdentityManagementService], children: [
//       { path: 'projects', component: ListViewComponent },
//       { path: '', redirectTo: 'projects', pathMatch: 'full' }
//     ]
//   },
//   { path: 'invoice', component: InvoiceComponent, pathMatch: 'full' }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewComponent } from './map-view/map-view.component';
import { IdentityManagementService } from './services/identity-management.service';
import { ListViewComponent } from './list-view/list-view.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InvoiceComponent } from './invoice/invoice.component';



const routes: Routes = [
  {
    path: 'app', component: MapViewComponent, canActivate: [IdentityManagementService], children: [
      { path: 'projects', component: ListViewComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' }
    ]
  },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'invoice', component: InvoiceComponent, pathMatch: 'full' },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}