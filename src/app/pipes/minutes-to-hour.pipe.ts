import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteToHour'
})
export class MinutesToHourPipe implements PipeTransform {

  transform(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours} ${hours > 1 ? 'Hours' : 'Hour'} & ${remainingMinutes} ${remainingMinutes > 1 ? 'Minutes' : 'Minute'}`;
  }

}
