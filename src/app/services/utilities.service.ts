import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

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
}
