import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';

/**
 * Controla funcionalidades reutilizables y genericas
 */
@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  /**
   * Constructor de la clase
   */
  constructor() { }

  /**
   * Retorna en formato binario un numero decimal
   *
   * @param number Numero a convertir
   *
   * @returns El numero expresado en binario
   */
  public convertToBinary(number: number): string {
    return number.toString(2);
  }

  /**
   * Retorna una cadena hasta completar la cantidad de caracteres especificados con el caracter indicado
   *
   * @param string Cadena a completar
   * @param character Caracter a replicar
   * @param quantityCharacter Cantidad de caracteres que debe tener la cadena finalmente
   *
   * @returns La cadena modificada
   */
  public fillString(string: string, character: string, quantityCharacter: number): string {
    return string.padStart(quantityCharacter, character);
  }

  /**
   * Retorna un entero aleatorio entre min (incluido) y max (excluido)
   *
   * @param min Numero minimo
   * @param max Numero maximo
   *
   * @returns El numero aleatorio
   */
  public generateRandomNumber(min: number = 500, max: number = 1500): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Calcula la suma de comprobacion del fragmento
   *
   * @param values Los binarios que componen el calculo
   *
   * @returns El numero decimal calculado
   */
  public sumHexadecimal(values: string[]): number {

    let result = 0;

    for (const tmpNumber of values) {
      result += parseInt(tmpNumber, 2);
    }

    const valueHexadecimal = result.toString(16);
    const positionToStart = valueHexadecimal.length - 4;

    return this.sumHexadecimalCarry(parseInt(valueHexadecimal.substring(positionToStart), 16), parseInt(valueHexadecimal.substring(0, positionToStart), 16));
  }

  /**
   * Realiza el acarreo de la suma de comprobacion de forma recursiva
   *
   * @param value Valor final de la suma en decimal sin el digito de acarreo
   * @param carry Valor de acarreo
   *
   * @returns El valor final que no supere el maximo decimal equivalente a FFFF en hexadecimal
   */
  private sumHexadecimalCarry(value: number, carry: number): number {

    const sum = value + carry;

    if (sum <= AppConstants.MAX_VALUE_HEXADECIMAL) {
      return sum;
    }

    const valueHexadecimal = sum.toString(16);
    const positionToStart = valueHexadecimal.length - 4;

    return this.sumHexadecimalCarry(parseInt(valueHexadecimal.substring(positionToStart), 16), parseInt(valueHexadecimal.substring(0, positionToStart), 16));
  }
}
