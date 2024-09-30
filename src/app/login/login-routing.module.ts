/** Angular core */
import { NgModule } from '@angular/core'

/** Angular router */
import { RouterModule, Routes } from '@angular/router'

/* Componentes */
import { LoginComponent } from '@login/index'

const routes: Routes = [
  {
    path: '', 
    component: LoginComponent    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
