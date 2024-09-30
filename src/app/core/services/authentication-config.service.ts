/** Angular core */
import { HttpBackend, HttpClient} from '@angular/common/http'
import { BehaviorSubject,Observable, map, take } from 'rxjs'

/** Http */
import { Injectable } from '@angular/core'

/** Servicios */
import { AuthenticationConfig } from '@core/index'

/** Otros */
import { localUrls } from '@data/consts'
import { AuthenticationConfigInterface } from '@core/models/authentication/authentication-config'
import { environment } from 'environments/environment'

@Injectable({
  providedIn: 'root'
})
/** Servicio encargado de cargar los parámetros de autenticación
 *  a partir de un fichero json de configuración
 */
export class AuthenticationConfigService {

  private _configurationFile: string
  public static apiConfiguration: BehaviorSubject<AuthenticationConfig | null>

  constructor(
    private http: HttpClient,
    private httpBackend: HttpBackend
  ) {
    /** Utilizamos el httpbackend para que esta consulta no pase por los interceptores */
    this.http = new HttpClient(httpBackend)
    // this._configurationFile = localUrls.apiFile

    this._configurationFile = environment.apiFile
    AuthenticationConfigService.apiConfiguration = new BehaviorSubject<AuthenticationConfig | null>(null)
  }

  /** Cargamos el fichero de conexión con la API. Si no existiese, el return devolverá null */
  loadConfiguration(): Observable<AuthenticationConfigInterface>{
    return this.http.get<AuthenticationConfigInterface>(
      this._configurationFile,
      {headers: {"Cache-Control":'no-cache'}}
    ).pipe(
      take(1),
      map(result => {
        AuthenticationConfigService.apiConfiguration.next(new AuthenticationConfig(result.url, result.authentication))
        return new AuthenticationConfig(result.url, result.authentication).authenticationConfig
      }),
    )
  }   
}
