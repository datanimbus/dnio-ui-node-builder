import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

import { CommonService } from '../common.service';

@Directive({
  selector: '[appJsonFileSelect]'
})
export class JsonFileSelectDirective {

  @Output() appJsonFileSelect: EventEmitter<any>;
  constructor(private commonUtils: CommonService) {
    this.appJsonFileSelect = new EventEmitter();
  }

  @HostListener('change', ['$event'])
  async onFileSelect($event: any) {
    const file: any = $event.target.files[0];
    const data: any = await this.commonUtils.readFileData(file);
    try {
      let json = JSON.parse(data);
      this.appJsonFileSelect.emit(json);
    } catch (err) {
      console.error('Error Parsing JSON');
      console.error(err);
    }
  }
}
