import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

import { CommonService } from '../common.service';

@Directive({
  selector: '[appJsonPaste]'
})
export class JsonPasteDirective {

  @Output() appJsonPaste: EventEmitter<any>;
  constructor(private commonUtils: CommonService) {
    this.appJsonPaste = new EventEmitter();
  }

  @HostListener('paste', ['$event'])
  onPaste($event: ClipboardEvent) {
    let data = $event.clipboardData?.getData('text') as string;
    try {
      let json = JSON.parse(data);
      let schema = this.commonUtils.convertJSONtoSchema(json);
      this.appJsonPaste.emit(schema);
    } catch (err) {
      console.error('Error Parsing JSON');
      console.error(err);
    }
  }
}
