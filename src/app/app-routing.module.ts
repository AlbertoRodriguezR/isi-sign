import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {
    path: 'login',
    loadChildren: () => import('@login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signature',
    loadChildren: () => import('@signature/signature.module').then(m => m.SignatureModule)
  },
  {path: '**', pathMatch:'full', redirectTo:'login'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
