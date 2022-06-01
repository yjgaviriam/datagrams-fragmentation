import { Pipe, PipeTransform } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';

@Pipe({
  name: 'systemsystem'
})
export class SystemsystemPipe implements PipeTransform {

  constructor(private utilitiesService: UtilitiesService) { }

  /**
   * @see PipeTransform#transform
   *
   * @param binaries Cadena con el binario
   * @param system Tipo de sistema [Binario, Hexadecimal]
   *
   * @returns La cadena modificada
   */
  transform(binaries: string | undefined, system: string): string {
    return (binaries === undefined ) ? '' : (system === 'Hexadecimal' ? this.transformHexadecimal(binaries.match(/.{8}/g) || []) : binaries);
  }

  /**
   * Toma un listado de binarios y lo convierte a hexadecimal
   *
   * @param binaries Cadena del binario
   *
   * @returns Una cadena con estructura hexadecimal
   */
  private transformHexadecimal(binaries: string[]): string {
    let result: string = '';

    for (const binary of binaries) {
      result += this.utilitiesService.fillString((parseInt(binary, 2)).toString(16).toUpperCase(), '0', 2);
    }

    return result;
  }
}
