/** Angular core */
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, take } from 'rxjs'

/** Http */
import { HttpBackend, HttpClient } from '@angular/common/http'

/** Módulo core */
import { localUrls } from '@data/consts'

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private _translationsSet: BehaviorSubject<any | null>
  public translationSet$: Observable<any | null>

  constructor(private http: HttpClient, private httpBackend: HttpBackend) {
    // this._translationsFile = `${localUrls.translationsPath}${navigator.language}.json`
    this._translationsSet = new BehaviorSubject<any | null>(null)
    this.translationSet$ = this._translationsSet.asObservable()

    /** Utilizamos el httpbackend para que esta consulta no pase por los interceptores */
    this.http = new HttpClient(httpBackend)
  }

  private getTranslationsFiles(language: string): any {
    switch (language) {
      case 'es':
        return {
          path: localUrls.spanishTranslationsPath,
        }
      case 'pt':
        return {
          path: localUrls.portugueseTranslationsPath,
        }
      default:
        return {
          path: localUrls.spanishTranslationsPath,
        }
    }
  }

  /** Nos guardamos en la memoria del servicio los datos de los ficheros de traducción y
   * creamos método para devolver las traducciones
   */
  setTranslations(language: string): any {
    const translationsFile = this.getTranslationsFiles(language)
    return new Promise<void>((resolve, reject) => {
      return this.http
        .get<any>(translationsFile.path)
        .pipe(take(1))
        .subscribe({
          next: translationObject => {
            this._translationsSet.next(translationObject)
            resolve()
          },
          error: err => {
            console.error('Error al cargar el fichero de traducciones')
            reject()
          },
        })
    })
  }

  getTranslation(word: string): string {
    return this._translationsSet.getValue()[word] as string
  }
}
