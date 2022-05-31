import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'systemFormat'
})
export class SystemFormatPipe implements PipeTransform {

  transform(number: string, format: string): unknown {
    return format === 'Hexadecimal' ? parseInt(number, 2).toString(16).toUpperCase(): number;
  }

}
