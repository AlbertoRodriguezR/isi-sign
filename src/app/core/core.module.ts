/** Angular core */
import { NgModule } from '@angular/core'

/** Módulo shared */
import { TranslationPipe, SharedModule } from '@shared/index'

@NgModule({
  declarations: [],
  providers: [TranslationPipe],
  imports: [
    SharedModule
  ]
})
export class CoreModule { }
