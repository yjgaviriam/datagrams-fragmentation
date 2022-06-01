import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateFormat'
})
export class SeparateFormatPipe implements PipeTransform {

  public transform(binaries: string, format: string): string {
    return format === 'Hexadecimal' ? (binaries.match(/.{2}/g) || []).join(' ') : (binaries.match(/.{32}/g) || []).join('\n');
  }
}
