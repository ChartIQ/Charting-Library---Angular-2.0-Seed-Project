import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'mapObjectToArrayPipe'})
export class MapObjectToArrayPipe implements PipeTransform{
  transform(value: any) {
    return Object.keys(value)
  }
}
