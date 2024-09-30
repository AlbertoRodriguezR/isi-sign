/** Angular core */
import { NgModule } from '@angular/core'

/** Módulo shared */
import { SharedModule } from '@shared/shared.module';
import { SignatureComponent } from './signature.component'
import { SignatureRoutingModule } from './signature.routing.module';

@NgModule({
  declarations: [
    SignatureComponent
  ],
  imports: [
    SignatureRoutingModule,
    SharedModule
  ]
})
export class SignatureModule { }
