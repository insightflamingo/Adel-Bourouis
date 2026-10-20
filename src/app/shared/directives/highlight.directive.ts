import { Directive, ElementRef, HostListener, Input, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input('appHighlight') highlightColor?: string;

  private originalColor: string = '';

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.originalColor = this.el.nativeElement.style.backgroundColor || '';
    const color = this.highlightColor && this.highlightColor.trim() ? this.highlightColor : '#fef9c3';
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.originalColor) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.originalColor);
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
    }
  }
}
