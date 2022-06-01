import { Pipe, PipeTransform } from '@angular/core';

/**
 * Separa la cadena recibida de acuerdo al sistema [Binario, Hexadecimal]
 */
@Pipe({
  name: 'separateFormat'
})
export class SeparateFormatPipe implements PipeTransform {

  /**
   * @see PipeTransform#transform
   *
   * @param string Cadena con el sistema binario o hexadecimal
   * @param system Tipo de sistema [Binario, Hexadecimal]
   *
   * @returns La cadena modificada
   */
  public transform(string: string, system: string): string {
    return system === 'Hexadecimal' ? (string.match(/.{2}/g) || []).join(' ') : (string.match(/.{32}/g) || []).join('\n');
  }
}
