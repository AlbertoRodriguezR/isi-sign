/** Angular core */
import { NgModule } from '@angular/core'

/** Componentes */
import { LoginComponent, LoginRoutingModule } from '@login/index'

/** Módulo shared */
import { SharedModule } from '@shared/index'

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    LoginRoutingModule,
    SharedModule
  ]
})
export class LoginModule { }