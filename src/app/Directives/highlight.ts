import { Directive, ElementRef, inject, input, signal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': 'isFocused() ? color() : ""',

    '(focus)': 'isFocused.set(true)',
    '(blur)': 'isFocused.set(false)',
  },
})
export class Highlight {
  private el = inject(ElementRef);
  color = input('lightyellow');

  isFocused = signal(false);
}