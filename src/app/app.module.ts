/** Angular core */
import { NgModule, APP_INITIALIZER } from '@angular/core'
import { APP_BASE_HREF} from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component'

/** Routing */
import { AppRoutingModule } from './app-routing.module'

/** Módulos */
import { LoaderService, SharedModule, TranslationService } from '@shared/index'
import { AuthenticationService, CoreModule, LoaderInterceptorService } from '@core/index'

/** Http */
import { HTTP_INTERCEPTORS } from '@angular/common/http'

/** Módulo core */
import { AuthInterceptorService } from '@core/index';

/** Incicializamos la aplicación cargando las traducciones. Si devuelve error,
 *  no cargará la página
  */
export function initializeApp(
  translationService: TranslationService,
  authenticationService: AuthenticationService
  ) {
  return async () => {    
    const userSession = authenticationService.checkUserLoggedIn()    
    if(userSession){
      await translationService.setTranslations(userSession.lng)  
    }else{
      await translationService.setTranslations('es')
    }
    authenticationService.retrieveProfileImage()
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TranslationService, AuthenticationService],
      multi: true
    },
    /** Para decirle a Angular que la aplicación está partiendo de un subdirectorio en
     *  la aplicación web
    */
    {provide: APP_BASE_HREF, useValue: '/'}, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
