/** Angular core */
import { Injectable } from '@angular/core'
import { catchError, Observable,throwError, of } from 'rxjs'

/** Http */
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http'

/** Routing */
import { Router } from '@angular/router'

/** Módulo core */
import { Authentication, AuthenticationConfigService } from '@core/index'

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  private _authType: string
    
  constructor(
    private router: Router,
  ){
    this._authType = ''
  }
  intercept(req : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {

    /** Si no existe el fichero de conexión con la API devuelve null */
    if(!AuthenticationConfigService.apiConfiguration?.value) {
      this.router.navigateByUrl('/login')
      return throwError(() => null )
    }

    /** Parametrizamos la llamada http a la API con los parámetros de configuración obtenidos */
    this._authType = AuthenticationConfigService.apiConfiguration.value.authentication.type

    let request = req

    request = req.clone({
      withCredentials: true
    })

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403){
          /** Si el error 403 viene de la lista de or´s, no lo interceptamos */
          // const {url} = this.router.routerState.snapshot
          
          // if(err.status === 403 && url === '/layout/or/list'){
          //   return of(null)
          // }

          // if(err.status === 403 && url === '/layout/presunto/modify'){
          //   return of(null)
          // }

          // this.router.navigate(['/login'])
        }
        return throwError(() => err)
      })
    )
  }
}