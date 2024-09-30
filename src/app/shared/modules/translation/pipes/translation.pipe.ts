/** Angular core */
import { Pipe, PipeTransform } from '@angular/core'

/** Servicios */
import { TranslationService } from '@shared/index'

@Pipe({
  name: 'translate'
})
export class TranslationPipe implements PipeTransform {

  constructor(private translationService: TranslationService){}

  /** Traducimos las etiquetas de la aplicación a través de un servicio
   *  que consulta los ficheros de idiomas y devuelve las traducciones
   */
  transform(word: string): string{
    return this.translationService.getTranslation(word)
  }

}
