import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdddistributorsComponent } from './distributorsinventory/adddistributors/adddistributors.component';
import { DistributorsinventoryComponent } from './distributorsinventory/distributorsinventory.component';
import { AuthGuard } from './guard/auth.guard';
import { InventoryComponent } from './inventory/inventory.component';
import { LoginComponent } from './login/login.component';
import { AddComponent } from './orders/add/add.component';
import { OrdersComponent } from './orders/orders.component';
import { UpdateComponent } from './orders/update/update.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateprofileComponent } from './profile/updateprofile/updateprofile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: 'order', component: OrdersComponent, canActivate: [AuthGuard] },
  {
    path: 'order/update',
    component: UpdateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'order/add', component: AddComponent, canActivate: [AuthGuard] },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'distributors',
    component: DistributorsinventoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'distributors/add',
    component: AdddistributorsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/update', component: UpdateprofileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
