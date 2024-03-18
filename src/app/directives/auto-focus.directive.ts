import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private ele: ElementRef) { }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ele.nativeElement.focus();
    }, 100);
  }

}
