import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(arr: Array<any>, ...args: string[]): any {
    const searchTerm = args[0];
    const key = args[1];
    return arr.filter((item) => {
      return _.toLower(item[key]).indexOf(_.toLower(searchTerm)) > -1
    });
  }

}