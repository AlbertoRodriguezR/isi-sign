/** Angular core */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common'

/** Forms */
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

/** Http */
import { HttpClientModule } from '@angular/common/http'

/** Módulo shared */
import { TranslationPipe, IsiButtonComponent, NotificationsComponent } from '@shared/index'

/** Librerías */
import { NgbToast, NgbCollapse, NgbNavModule, NgbDatepickerModule, NgbDateParserFormatter, NgbPaginationModule, NgbModalModule,
 } from '@ng-bootstrap/ng-bootstrap'

@NgModule({
  declarations: [
    TranslationPipe,
    IsiButtonComponent,
    NotificationsComponent,
    ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbToast,
    NgbCollapse,
    NgbNavModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    NgbModalModule,
  ],  
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslationPipe,
    NgbToast,
    NgbCollapse,
    NgbNavModule,
    IsiButtonComponent,
    NgbDatepickerModule,
    NgbPaginationModule,
    NgbModalModule,
    NotificationsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DecimalPipe, DatePipe]
})
export class SharedModule { }
