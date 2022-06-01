import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { UtilitiesService } from './utilities.service';
import { Protocols } from '../models/protocols.enum';
import { IAddresses } from '../models/addresses.interface';

@Injectable({
  providedIn: 'root'
})
export class FragmentService {

  constructor(private utilitiesService: UtilitiesService) { }

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
      result.push({ addresses, binaryResult, displacement: this.buildDisplacement(totalBytesSent, positionCurrentFragment), fragmentation: this.buildFragmentationInformation(quantityFragments, positionCurrentFragment), fragmentTotalLength, identificationNumber, protocol, timeToLive });
      totalBytesSent += fragmentTotalLength - AppConstants.HEADER_LENGTH_VALUE;
      positionCurrentFragment++;
    }

    return result;
  }

  private buildChecksum(binaryData: string): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(
      AppConstants.MAX_VALUE_HEXADECIMAL - this.utilitiesService.sumHexadecimal(binaryData.match(/.{16}/g) || [])), '0', 16
    );
  }

  private buildDestinationAddress(destinationAddress: string): string {
    const resultArray: string[] = [];
    const destinationArray = destinationAddress.split('.');

    for (const ip of destinationArray) {
      resultArray.push(this.utilitiesService.fillString(this.utilitiesService.convertToBinary(Number(ip)), '0', 8));
    }

    return this.utilitiesService.fillString(resultArray.join(''), '0', 32);
  }

  private buildDifferentiatedServices(): string {
    return AppConstants.DIFFERENTIATED_SERVICES_BINARY_VALUE;
  }

  private buildDisplacement(totalBytesSent: number, positionCurrentFragment: number): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(positionCurrentFragment === 1 ? 0 : (totalBytesSent / 8)), '0', 13)
  }

  private buildFragmentationInformation(quantityFragments: number, positionCurrentFragment: number): string {
    return `0${Number(!(quantityFragments > 1))}${Number(!((quantityFragments > 1 && positionCurrentFragment === quantityFragments) || quantityFragments === 1))}`;
  }

  private buildFragmentTotalLength(fragmentTotalLength: number): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(fragmentTotalLength), '0', 16);
  }

  private buildHeaderLength(): string {
    return AppConstants.HEADER_LENGTH_BINARY_VALUE;
  }

  private buildIdentificationNumber(identificationNumber: number): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(identificationNumber), '0', 16);
  }

  private buildInternetProtocolVersion(): string {
    return AppConstants.INTERNET_PROTOCOL_VERSION_BINARY_VALUE;
  }

  private buildProtocol(protocol: string): string {
    const index = Object.keys(Protocols).indexOf(protocol as unknown as Protocols);
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(Number(Object.values(Protocols)[index])), '0', 8);
  }

  private buildSourceAddress(sourceAddress: string): string {
    const resultArray: string[] = [];
    const sourceArray = sourceAddress.split('.');

    for (const ip of sourceArray) {
      resultArray.push(this.utilitiesService.fillString(this.utilitiesService.convertToBinary(Number(ip)), '0', 8));
    }

    return this.utilitiesService.fillString(resultArray.join(''), '0', 32);
  }

  private buildTimeToLive(timeToLive: number): string {
    return this.utilitiesService.fillString(this.utilitiesService.convertToBinary(timeToLive), '0', 8)
  }

  private calculateFragmentLengthSent(fragmentLength: number): number {
    while ((fragmentLength % 8) !== 0) {
      fragmentLength--;
    }
    return fragmentLength;
  }
}
