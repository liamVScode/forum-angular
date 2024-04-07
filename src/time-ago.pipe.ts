import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      const differenceInSeconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (differenceInSeconds < 60) {
        return `${differenceInSeconds} giây trước`;
      } else if (differenceInSeconds >= 60 && differenceInSeconds < 3600) {
        return `${Math.floor(differenceInSeconds / 60)} phút trước`;
      } else if (differenceInSeconds >= 3600 && differenceInSeconds < 86400) {
        return `${Math.floor(differenceInSeconds / 3600)} giờ trước`;
      } else if (differenceInSeconds >= 86400 && differenceInSeconds < 259200) {
        return `${Math.floor(differenceInSeconds / 86400)} ngày trước`;
      } else {
        const date = new Date(value);
        return date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
    }
    return value;
  }
}
