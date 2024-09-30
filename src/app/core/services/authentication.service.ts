/** Angular core */
import { Injectable } from '@angular/core'
import {
  BehaviorSubject,
  Observable,
  map,
  take,
  tap,
  throwError,
  of,
  catchError,
  Subscription,
} from 'rxjs'

/** Http */
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http'

/** Módulo core */
import {
  AuthenticationConfigService,
  Authentication,
  AuthenticationInterface,
  Session,
  EmptySession,
  LoginErrorTypes,
} from '@core/index'

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _loggedIn: BehaviorSubject<boolean>
  public loggedIn$: Observable<boolean>
  private _apiUrl: string
  private _userSession: BehaviorSubject<Session>
  public userSession$: Observable<Session>
  private _profileImage: BehaviorSubject<any>
  public profileImage$: Observable<any>
  private userSessionSubscription: Subscription

  constructor(private http: HttpClient) {
    this._loggedIn = new BehaviorSubject<boolean>(false)

    /** Pasamos la variable _loggedIn a un observable para encapsular el servicio
     *  y que sólo se acceda al estado a traves del observable
     */
    this.loggedIn$ = this._loggedIn.asObservable()
    // this._token = ''
    this._apiUrl = ''
    this._userSession = new BehaviorSubject<Session>(EmptySession)
    this.userSession$ = this._userSession.asObservable()
    this._profileImage = new BehaviorSubject<any>(null)
    this.profileImage$ = this._profileImage.asObservable()

    this.userSessionSubscription = this.userSession$.subscribe()
  }

  login(authObject: AuthenticationInterface): Observable<any | null> {
    /** Si no existe el fichero de conexión con la API devuelve null */
    if (!AuthenticationConfigService.apiConfiguration?.value) {
      console.error(
        'Error en !AuthenticationConfigService.apiConfiguration?.value)'
      )

      return throwError(() => null)
    }

    /** Obtenemos los parámetros de conexión a partir del fichero de configuración */
    const auth = new Authentication()
    auth.setAuthObject(authObject)

    /** Parametrizamos la llamada http a la API con los parámetros de configuración obtenidos */
    this._apiUrl = AuthenticationConfigService.apiConfiguration.value.url

    const body = auth.getAuthenticationRequestData()
    const url =
      AuthenticationConfigService.apiConfiguration.value.authentication.url

    const headers: HttpHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    )

    return this.http.post<any>(url, body, { headers }).pipe(
      take(1),
      catchError(httpError =>
        throwError(() => {
          console.error('Error catch login', httpError)
          return this.handleLoginError(httpError.status)
        })
      )
    )
  }

  getAuthenticatedUser(): Observable<any> {
    const url: string = this._apiUrl + '/global-data'

    return this.http.get<any>(url).pipe(
      take(1),
      map(response => {
        const { usuario, nombre, lng, empOmi, empOmiDes } = response.data

        const userSession: Session = {
          usuario,
          nombre,
          lng,
          empOmi,
          empOmiDes,
        }
        return userSession
      }),
      tap({
        next: (response: any) => {
          if (response) {
            this.setUserSession(response)
            return response
          }
          throwError(() => of(response))
        },
      }),
      //   concatMap(() => this.getProfileImage().pipe(
      //     take(1),
      //     tap({
      //       next: (profileImage: string) => {
      //         this._profileImage.next(profileImage)
      //         this.saveProfileImage(profileImage)
      //       },
      //       error: error => error
      //     }),
      //   )
      // ),
      catchError(httpError =>
        throwError(() => {
          console.error('catch en getAuthenticatedUser', httpError)
          this.handleLoginError(httpError.status)
        })
      )
    )
  }

  handleLoginError(errorStatus: number): number {
    switch (errorStatus) {
      case 404:
        return LoginErrorTypes.LOGIN_NOT_FOUND
      case 401:
        return LoginErrorTypes.LOGIN_UNAUTHORIZED
      case 403:
        return LoginErrorTypes.LOGIN_FORBIDDEN
      case 500:
        return LoginErrorTypes.LOGIN_UNKNOWN
      default:
        return LoginErrorTypes.LOGIN_UNKNOWN
    }
  }

  handleSessionError(errorStatus: number): number {
    switch (errorStatus) {
      case 404:
        return LoginErrorTypes.LOGIN_SESSION_NOT_FOUND
      case 500:
        return LoginErrorTypes.LOGIN_SESSION_UNKNOWN
      default:
        return LoginErrorTypes.LOGIN_SESSION_UNKNOWN
    }
  }

  handleProfileImageError(errorStatus: number) {
    switch (errorStatus) {
      case 404:
        return LoginErrorTypes.PROFILE_IMAGE_NOT_FOUND
      case 500:
        return LoginErrorTypes.PROFILE_IMAGE_UNKNOWN
      default:
        return LoginErrorTypes.LOGIN_UNKNOWN
    }
  }

  // getAuthenticatedUser(): Observable<Session>{

  //   const url: string = this._apiUrl + "/global-data"

  //   return this.http.get<any>(url)
  //     .pipe(
  //       take(1),
  //       map(response => {
  //         const {usuario, nombre, lng, empOmi, empOmiDes} = response.data

  //         const userSession: Session = {
  //           usuario,
  //           nombre,
  //           lng,
  //           empOmi,
  //           empOmiDes
  //         }
  //         return userSession
  //       }),
  //       tap((userSession: Session) => {
  //         this.setUserSession(userSession)
  //       })
  //     )
  // }

  public handleLogout(): void {
    const url =
      AuthenticationConfigService.apiConfiguration.value.authentication.logout
    this.http
      .post<any>(url, null)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.userSessionSubscription.unsubscribe()
          // this._userSession.next(EmptySession)

          this.removeSession()
        },
      })
  }

  public checkUserLoggedIn(): Session | null {
    /** Primero devolvemos la sesión almacenada en el estado global */
    if (this._userSession.value !== EmptySession) return this._userSession.value

    const userSession = localStorage.getItem('isiparts-session')
    if (userSession) {
      const userSessionObject = JSON.parse(userSession)
      this._userSession.next(userSessionObject)

      return userSessionObject
    }

    return null
  }

  public retrieveProfileImage(): any {
    /** Primero devolvemos la sesión almacenada en el estado global */
    if (this._profileImage.value) return

    const profileImage = localStorage.getItem('isiparts-profile-img')

    if (profileImage) {
      const profileImageObject = JSON.parse(profileImage)
      this._profileImage.next(profileImageObject)

      return profileImageObject
    }

    return null
  }

  setUserSession(userSessionObject: Session): void {
    this._userSession.next(userSessionObject)
    this.saveSession(userSessionObject)
  }

  private saveSession(session: Session): void {
    const userSession = localStorage.getItem('isiparts-session')
    if (!userSession) {
      const sessionString = JSON.stringify(session)
      localStorage.setItem('isiparts-session', sessionString)
    }
  }

  private removeSession(): void {
    if (localStorage.getItem('isiparts-session')) {
      localStorage.removeItem('isiparts-session')
    }

    if (localStorage.getItem('isiparts-profile-img')) {
      localStorage.removeItem('isiparts-profile-img')
    }
  }

  private saveProfileImage(profile: any): void {
    /** Guardamos la imagen de perfil */
    const profileImage = localStorage.getItem('isiparts-profile-img')
    if (!profileImage) {
      const profileString = JSON.stringify(profile)
      localStorage.setItem('isiparts-profile-img', profileString)
    }
  }
}
