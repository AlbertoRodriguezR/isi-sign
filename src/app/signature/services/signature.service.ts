import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  APIResponse,
  AuthenticationConfigService,
  AuthenticationService,
  Session,
} from '@core/index'
import { TranslationPipe } from '@shared/index'
import { Observable, catchError, concatMap, map, of, tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SignatureService {
  private _apiUrl: string

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private translationPipe: TranslationPipe
  ) {
    this._apiUrl = AuthenticationConfigService.apiConfiguration.value
      ? AuthenticationConfigService.apiConfiguration.value?.url
      : ''
  }

  loadDocuments(deviceName): Observable<any[]> {
    /** Si no existe el fichero de conexión con la API devuelve null */
    if (!AuthenticationConfigService.apiConfiguration?.value) {
      return of(null)
    }

    let language = 'es'
    let url: string = ''
    return this.authenticationService.userSession$.pipe(
      tap((userSession: Session) => {
        language = userSession.lng
        url = `${this._apiUrl}/empresas/${userSession.empOmi}/firma?lng=${language}`
      }),
      concatMap(() => {
        return this.http.get<APIResponse>(url).pipe(
          map(response => {
            if (!response || !response.success) {
              /** Lanzamos el error mediante este observable para ser recogido
               *  por la subscripción en la lista de OR
               */
              throw new Error(response.message)
            }

            const { data } = response

            return data
              .map((item: any) => {
                return {
                  document: item.documento,
                  description: item.descripcion,
                  device: item.dispositivo,
                }
              })
              .filter(item => item.device === deviceName)
          }),
          catchError((httpError: HttpErrorResponse) => {
            /** Cargamos el código de error en un observable para ser recogido en su
             *  subscripción dentro de la modificción WO: allí se muestra el error.
             */
            if (httpError && httpError.error && httpError.error.message) {
              const { error } = httpError

              /** LOG */
              throw new Error(error.message)
            } else {
              const errorMessage = this.translationPipe.transform(
                'signature.documents.list.error'
              )
              throw new Error(errorMessage)
            }
          })
        )
      })
    )
  }
}
