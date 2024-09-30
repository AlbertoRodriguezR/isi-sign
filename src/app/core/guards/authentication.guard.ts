/** Angular core */
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

/** Router */
import { CanLoad, Router, Route, UrlSegment, RouteConfigLoadEnd } from '@angular/router'
import { AuthenticationConfigService, AuthenticationService } from '@core/index'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad{

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private configService: AuthenticationConfigService,
  ){
  }  

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean>|Promise<boolean>|boolean {
    const isUserLoggedIn = this.authenticationService.checkUserLoggedIn()
    if(!isUserLoggedIn){
        this.router.navigate(['login'])
        return false
    }

    this.configService.loadConfiguration().subscribe({
      error: () => {
        this.router.navigate(['login'])
        return false
      }
    })
    
    return true    
  }
}