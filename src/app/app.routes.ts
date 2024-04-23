import { Routes } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';

export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: SidenavComponent },
];
