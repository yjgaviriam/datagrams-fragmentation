import { IAddresses } from './addresses.interface';

/**
 * Estructura de un fragmento para presentar
 */
export interface IFragment {

  /**
   * Direcciones de origen y destino
   */
  addresses: IAddresses;

  /**
   * Cadena binaria del fragmento calculado
   */
  binaryResult: string;

  /**
   * Binario equivalente al desplazamiento del fragmento
   */
  displacement: string;

  /**
   * Informacion de fragmentacion
   */
  fragmentation: string;

  /**
   * Longitud del fragmento
   */
  fragmentTotalLength: number;

  /**
   * Numero que identifica el datagrama
   */
  identificationNumber: number;

  /**
   * Protocolo de transmision del datagrama
   */
  protocol: string;

  /**
   * Tiempo de vida del fragmento
   */
  timeToLive: number;
}
