import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(arr: Array<any>, ...args: any[]): any {
    let keys = args[0];
    if (typeof keys == 'string') {
      keys = keys.split(',');
    }
    const searchTerm = args[1] as string;
    return arr.filter((item) => {
      let flag = false;
      keys.forEach((key: string) => {
        if (_.toLower(item[key]).indexOf(_.toLower(searchTerm)) > -1) {
          flag = true;
        }
      });
      return flag;
    });
  }

}
