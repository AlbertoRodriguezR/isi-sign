/** Angular core */
import { NgModule } from '@angular/core'

import { RouterModule, Routes } from '@angular/router'

/** Módulo shared */
import { SharedModule } from '@shared/index'

/** Módulo signature */
import { SignatureComponent } from '@signature/index'

const routes: Routes = [
  {
    path: '', 
    component: SignatureComponent    
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignatureRoutingModule { }
