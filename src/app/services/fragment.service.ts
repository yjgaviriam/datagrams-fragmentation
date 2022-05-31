import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class FragmentService {

  constructor() { }

  private buildDatagramHeader(fragmentLength: number): string {
    return this.buildProtocolVersion() + this.buildHeaderLength() + this.buildDifferentiatedServices() + this.buildFragmentLength(fragmentLength);
  }

  public buildDatagramHeaders(mtu: number, datagramLength: number, protocol: string, address: { destination: string, source: string },
    identificationNumber: number, timeToLive: number): string[] {

    const result: string[] = [];

    const quantityFragments = Math.ceil(datagramLength / mtu);
    let fragmentsSent = 0;
    let count = 1;

    // for (let i = 0; i < quantityFragments; i++) {
    //   result.push(this.buildDatagramHeader(fragmentLength));

    // }

    do {
      const fragmentLength = (datagramLength > mtu) ? (count === quantityFragments ? (datagramLength - fragmentsSent - AppConstants.HEADER_LENGTH_VALUE) : mtu) : datagramLength;
      result.push(this.buildDatagramHeader(fragmentLength));
      fragmentsSent += this.calculateFragmentLengthSent(fragmentLength);
      count++;
      console.log(fragmentLength, fragmentsSent, count);

    } while (count <= quantityFragments);

    return result;
  }

  private buildDifferentiatedServices(): string {
    return AppConstants.DIFFERENTIATED_SERVICES_BINARY_VALUE;
  }

  private buildFragmentLength(fragmentLength: number): string {
    return '';
  }

  private buildHeaderLength(): string {
    return AppConstants.HEADER_LENGTH_BINARY_VALUE;
  }

  private buildProtocolVersion(): string {
    return AppConstants.INTERNET_PROTOCOL_VERSION_BINARY_VALUE;
  }

  private calculateFragmentLengthSent(fragmentLength: number): number {
    // (datagramLength > mtu) ? (count === quantityFragments ? (datagramLength - fragmentsSent) : mtu ) : datagramLength

    while ((fragmentLength % 8) !== 0) {
      fragmentLength--;
    }

    console.log('fragmentLength', fragmentLength);


    return  fragmentLength - AppConstants.HEADER_LENGTH_VALUE;
  }
}
