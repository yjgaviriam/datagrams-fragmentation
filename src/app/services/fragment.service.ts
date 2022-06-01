import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { UtilitiesService } from './utilities.service';
import { Protocols } from '../models/protocols.enum';
import { IAddresses } from '../models/addresses.interface';
import { IFragment } from '../models/fragment.interface';

/**
 * Servicio de controlar la logica de calculo del datagrama
 */
@Injectable({
  providedIn: 'root'
})
export class FragmentService {

  /**
   * Constructor de la clase
   *
   * @param utilitiesService Servicio con funcionalidades reutilizables y genericas
   */
  constructor(private utilitiesService: UtilitiesService) { }

  /**
   * Construye el fragmento
   *
   * @param fragmentTotalLength Longitud del fragmento
   * @param identificationNumber Identificador del datagrama
   * @param quantityFragments Cantidad de fragmentos del datagrama
   * @param positionCurrentFragment El numero de fragmento operado en el momento
   * @param totalBytesSent La cantidad de bytes enviados del datagrama
   * @param timeToLive Tiempo de vida del datagrama
   * @param protocol Protocol por el que se envia el datagrama
   * @param addresses Direcciones de origen y destino
   *
   * @returns La cadena en binario con el resultado del calculo del datagrama
   */
  private buildDatagramHeader(fragmentTotalLength: number, identificationNumber: number, quantityFragments: number, positionCurrentFragment: number,
    totalBytesSent: number, timeToLive: number, protocol: string, addresses: IAddresses): string {
    return this.buildInternetProtocolVersion() +
      this.buildHeaderLength() +
      this.buildDifferentiatedServices() +
      this.buildFragmentTotalLength(fragmentTotalLength) +
      this.buildIdentificationNumber(identificationNumber) +
      this.buildFragmentationInformation(quantityFragments, positionCurrentFragment) +
      this.buildDisplacement(totalBytesSent, positionCurrentFragment) +
      this.buildTimeToLive(timeToLive) +
      this.buildProtocol(protocol) +
      this.buildChecksum(this.buildInternetProtocolVersion() + this.buildHeaderLength() + this.buildDifferentiatedServices() +
        this.buildFragmentTotalLength(fragmentTotalLength) + this.buildIdentificationNumber(identificationNumber) +
        this.buildFragmentationInformation(quantityFragments, positionCurrentFragment) + this.buildDisplacement(totalBytesSent, positionCurrentFragment) +
        this.buildTimeToLive(timeToLive) + this.buildProtocol(protocol) + this.buildSourceAddress(addresses.source) + this.buildDestinationAddress(addresses.destination)
      ) +
      this.buildSourceAddress(addresses.source) +
      this.buildDestinationAddress(addresses.destination);
  }

  /**
   * Construye el/los fragmentos del datagrama
   *
   * @param mtu Capacidad maxima de transmision
   * @param datagramLength Longitud del datagrama
   * @param protocol Protocol por el que se envia el datagrama
   * @param addresses Direcciones de origen y destino
   * @param identificationNumber Identificador del datagrama
   * @param timeToLive Tiempo de vida del datagrama
   *
   * @returns El/los fragmentos construidos
   */
  public buildDatagramHeaders(mtu: number, datagramLength: number, protocol: string, addresses: IAddresses,
    identificationNumber: number, timeToLive: number): string[] {

    const result: any[] = [];
    const quantityFragments = Math.ceil(datagramLength / mtu);
    let totalBytesSent = 0;
    let positionCurrentFragment = 1;

    while (positionCurrentFragment <= quantityFragments) {
      const fragmentLength = (datagramLength > mtu) ? (positionCurrentFragment === quantityFragments ? (datagramLength - totalBytesSent) : mtu) : datagramLength;
      const fragmentTotalLength = (positionCurrentFragment === quantityFragments) ? fragmentLength : this.calculateFragmentLengthSent(fragmentLength - AppConstants.HEADER_LENGTH_VALUE) + AppConstants.HEADER_LENGTH_VALUE;
      const binaryResult = this.buildDatagramHeader(fragmentTotalLength, identificationNumber, quantityFragments, positionCurrentFragment, totalBytesSent, timeToLive, protocol, addresses);
      const fragment: IFragment = { addresses, binaryResult, displacement: this.buildDisplacement(totalBytesSent, positionCurrentFragment), fragmentation: this.buildFragmentationInformation(quantityFragments, positionCurrentFragment), fragmentTotalLength, identificationNumber, protocol, timeToLive };
      result.push(fragment);
      totalBytesSent += fragmentTotalLength - AppConstants.HEADER_LENGTH_VALUE;
      positionCurrentFragment++;
    }

    return result;
  }

  /**
   * Calcula la suma de comprobacion
   *
   * @param binaryData La cadena con todos los elementos a tener en cuenta en la suma
   *
   * @returns El binario calculado
   */
  private buildChecksum(binaryData: string): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(
      AppConstants.MAX_VALUE_HEXADECIMAL - this.utilitiesService.sumHexadecimal(binaryData.match(/.{16}/g) || [])), '0', 16
    );
  }

  /**
   * Calcula el binario de la direccion de destino
   *
   * @param destinationAddress Direcciond de destino
   *
   * @returns El binario calculado
   */
  private buildDestinationAddress(destinationAddress: string): string {
    const resultArray: string[] = [];
    const destinationArray = destinationAddress.split('.');

    for (const ip of destinationArray) {
      resultArray.push(this.utilitiesService.fillString(this.utilitiesService.convertToBinary(Number(ip)), '0', 8));
    }

    return this.utilitiesService.fillString(resultArray.join(''), '0', 32);
  }

  /**
   * Calcula el binario de los servicios diferenciados
   *
   * @returns El binario calculado
   */
  private buildDifferentiatedServices(): string {
    return AppConstants.DIFFERENTIATED_SERVICES_BINARY_VALUE;
  }

  /**
   * Calcula el binario del valor de desplazamiento del fragmento
   *
   * @param totalBytesSent La cantidad de bytes del datagrama ya enviados
   * @param positionCurrentFragment Fragmento actualmente calculado
   *
   * @returns El binario calculado
   */
  private buildDisplacement(totalBytesSent: number, positionCurrentFragment: number): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(positionCurrentFragment === 1 ? 0 : (totalBytesSent / 8)), '0', 13)
  }

  /**
   * Calcula el binario de la informacion de fragmentacion
   *
   * @param quantityFragments Numero total de fragmentos del datagrama
   * @param positionCurrentFragment Fragmento actualmente calculado
   *
   * @returns El binario calculado
   */
  private buildFragmentationInformation(quantityFragments: number, positionCurrentFragment: number): string {
    return `0${Number(!(quantityFragments > 1))}${Number(!((quantityFragments > 1 && positionCurrentFragment === quantityFragments) || quantityFragments === 1))}`;
  }

  /**
   * Calcula el binario de la longitud del fragmento
   *
   * @param fragmentTotalLength Longitud total del fragmento
   *
   * @returns El binario calculado
   */
  private buildFragmentTotalLength(fragmentTotalLength: number): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(fragmentTotalLength), '0', 16);
  }

  /**
   * Calcula el binario de la longitud del encabezado
   *
   * @returns El binario calculado
   */
  private buildHeaderLength(): string {
    return AppConstants.HEADER_LENGTH_BINARY_VALUE;
  }

  /**
   * Calcula el binario del numero de identificacion
   *
   * @param identificationNumber Identificador del datagrama
   *
   * @returns El binario calculado
   */
  private buildIdentificationNumber(identificationNumber: number): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(identificationNumber), '0', 16);
  }

  /**
   * Calcula el binario del protocolo IPv4
   *
   * @returns El binario calculado
   */
  private buildInternetProtocolVersion(): string {
    return AppConstants.INTERNET_PROTOCOL_VERSION_BINARY_VALUE;
  }

  /**
   * Calcula el binario del protocolo de transmision [ICMP, TCP, UDP]
   *
   * @param protocol El nombre del protocolo
   *
   * @returns El binario calculado
   */
  private buildProtocol(protocol: string): string {
    const index = Object.keys(Protocols).indexOf(protocol as unknown as Protocols);
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(Number(Object.values(Protocols)[index])), '0', 8);
  }

  /**
   * Calcula el binario de la direccion de origen
   *
   * @param sourceAddress Direcciond de origen
   *
   * @returns El binario calculado
   */
  private buildSourceAddress(sourceAddress: string): string {
    const resultArray: string[] = [];
    const sourceArray = sourceAddress.split('.');

    for (const ip of sourceArray) {
      resultArray.push(this.utilitiesService.fillString(this.utilitiesService.convertToBinary(Number(ip)), '0', 8));
    }

    return this.utilitiesService.fillString(resultArray.join(''), '0', 32);
  }

  /**
   * Calcula el binario del tiempo de vida del datagrama
   *
   * @param timeToLive Tiempo de vida
   *
   * @returns El binario calculado
   */
  private buildTimeToLive(timeToLive: number): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(timeToLive), '0', 8)
  }

  /**
   * Calcula el siguiente entero multiplo de 8 para cumplir con la condiccion de desplazamiento
   *
   * @param fragmentLength Longitud del fragmento
   *
   * @returns El binario calculado
   */
  private calculateFragmentLengthSent(fragmentLength: number): number {
    while ((fragmentLength % 8) !== 0) {
      fragmentLength--;
    }
    return fragmentLength;
  }
}
