/** Angular core */
import { Injectable } from '@angular/core'
import { finalize, Observable } from 'rxjs'

/** Http */
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http'

/** Módulo shared */
import { LoaderService } from '@shared/index'

@Injectable()
export class LoaderInterceptorService implements HttpInterceptor {
    
  constructor(
    private loaderService: LoaderService
  ){

  }
  intercept(request : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {

    this.loaderService.show()

    return next.handle(request).pipe(
      finalize(() => this.loaderService.hide())
    )
  }
}