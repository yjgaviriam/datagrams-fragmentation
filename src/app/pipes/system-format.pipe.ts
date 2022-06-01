import { Pipe, PipeTransform } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';

@Pipe({
  name: 'systemFormat'
})
export class SystemFormatPipe implements PipeTransform {

  constructor(private utilitiesService: UtilitiesService) { }

  transform(binaries: string, format: string): string {
    return format === 'Hexadecimal' ? this.transformHexadecimal(binaries.match(/.{8}/g) || []) : binaries;
  }

  private transformHexadecimal(binaries: string[]): string {
    let result: string = '';

    for (const binary of binaries) {
      result += this.utilitiesService.fillString((parseInt(binary, 2)).toString(16).toUpperCase(), '0', 2);
    }

    return result;
  }
}
