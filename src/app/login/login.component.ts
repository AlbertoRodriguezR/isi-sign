/** Angular core */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { concatMap } from 'rxjs'

/** Routing */
import { Router } from '@angular/router'

/** Http */
import { HttpErrorResponse } from '@angular/common/http'

/** Angular forms */
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'

/** Módulo core */
import {
  AuthenticationConfigService,
  AuthenticationInterface,
  AuthenticationService,
  LoginErrorTypes,
} from '@core/index'

/** Módulo login */
// import { loginErrorHandler } from '@modules/login'

/** Módulo shared */
import { TranslationPipe } from '@shared/index'

/** Módulo login */
import { LoginService } from '@login/index'
import { NotificationsService } from '@shared/modules/notifications/services/notifications.service'
import { loginErrorHandler } from './shared/error-handler'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [TranslationPipe],
})
export class LoginComponent implements OnInit {
  // @ViewChild("image") image: ElementRef

  public loginForm: FormGroup
  public auth: AuthenticationInterface = {
    username: '',
    password: '',
  }

  constructor(
    private formBuilder: FormBuilder,
    private configService: AuthenticationConfigService,
    protected authService: AuthenticationService,
    private router: Router,
    private translationPipe: TranslationPipe,
    private notificationService: NotificationsService,
    private loginService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

  /** Definimos los getters para tener las variables disponibles en el template */
  get username(): FormControl {
    return this.loginForm.get('username') as FormControl
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl
  }

  ngOnInit(): void {
    /** Cargamos la configuración de la API aquí y no en la inicialización de la
     *  aplicación para poder gestionar mensajes de aviso en lugar de dejar de
     *  cargar la página
     */
    this.configService.loadConfiguration().subscribe({
      error: error => {
        this.showLoadingErrorMessage()
      },
    })
  }

  showLoadingErrorMessage() {
    const errorMessage = this.translationPipe.transform('global.error.api.file')
    this.notificationService.showError(errorMessage)
  }

  onSubmit(): void {
    this.auth = {
      username: this.username.value,
      password: this.password.value,
    }

    /** Marcamos como pending el formulario de login para los errores asíncronos, y así, al
     * deshabilitar el botón submit si no es válido, incluims también el momento de espera
     * hasta que se resuelve la peticón asíncrona
     */
    this.loginForm.markAsPending()

    this.loginService.resetTablesState()
    this.authService
      .login(this.auth)
      .pipe(concatMap(() => this.authService.getAuthenticatedUser()))
      .subscribe({
        next: (results: any) => {
          if (results === null) {
            this.handleError(LoginErrorTypes.LOGIN_UNKNOWN)
          } else {
            this.router.navigate(['signature'])
          }
        },
        error: (errorCode: any) => {
          /** En caso de que venga un null tenemos un error no catalogado */
          if (!errorCode && errorCode !== 0) {
            this.handleError(LoginErrorTypes.LOGIN_UNKNOWN)
          } else {
            /** Si no se ha encontrado la imagen de perfil iniciamos sesión igualmente */
            if (errorCode === LoginErrorTypes.PROFILE_IMAGE_NOT_FOUND)
              this.router.navigate(['layout/or/list'])
            else this.handleError(errorCode)
          }
        },
      })
  }

  /** Mostramos mensaje de error y bloqueamos formulario */
  private handleError(errorCode: number): void {
    const errorMessage: string = loginErrorHandler(errorCode)
    const translatedErrorMessage = this.translationPipe.transform(errorMessage)
    this.showErrorMessage(translatedErrorMessage)

    /** Marcamos el formulario con errores (error customizado) para bloquear el botón de inicio de sesión */
    this.loginForm.setErrors({ requestResponseError: true })
  }

  showErrorMessage(errorMessage: string): void {
    this.notificationService.showError(errorMessage)
  }
}
