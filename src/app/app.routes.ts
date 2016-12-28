import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { RestrictedComponent } from './restricted';

import {AuthGuardArea} from "./services/authGuardArea";
import {AccessDenied} from "./login/accessDenied.component";


export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  {
    canActivate: [AuthGuardArea],
    path: 'restricted',
    component: RestrictedComponent
  },
  { path: 'access-denied',  component: AccessDenied }

];
