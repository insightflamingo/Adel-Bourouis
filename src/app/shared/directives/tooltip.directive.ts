import { Directive, ElementRef, HostListener, Input, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  @Input('appTooltip') tooltipText?: string | null;

  private tooltipElement: HTMLElement | null = null;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipText || !this.tooltipText.trim()) {
      return;
    }

    // Création de l'élément <span>
    this.tooltipElement = this.renderer.createElement('span');

    // Création du texte
    const text = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(this.tooltipElement, text);

    // Styling de la bulle
    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'zIndex', '9999');
    this.renderer.setStyle(this.tooltipElement, 'maxWidth', '20rem');
    this.renderer.setStyle(this.tooltipElement, 'padding', '0.375rem 0.625rem');
    this.renderer.setStyle(this.tooltipElement, 'fontSize', '0.75rem');
    this.renderer.setStyle(this.tooltipElement, 'lineHeight', '1rem');
    this.renderer.setStyle(this.tooltipElement, 'color', '#ffffff');
    this.renderer.setStyle(this.tooltipElement, 'backgroundColor', '#0f172a');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '0.375rem');
    this.renderer.setStyle(this.tooltipElement, 'boxShadow', '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -4px rgba(0, 0, 0, 0.1)');
    this.renderer.setStyle(this.tooltipElement, 'wordBreak', 'break-word');
    this.renderer.setStyle(this.tooltipElement, 'pointerEvents', 'none');

    // Positionnement calculé par rapport à l'élément hôte
    const rect = this.el.nativeElement.getBoundingClientRect();
    const tooltipLeft = Math.max(8, rect.left);
    this.renderer.setStyle(this.tooltipElement, 'left', `${tooltipLeft}px`);

    // Insérer dans le body pour éviter tout découpage par overflow: hidden/auto
    this.renderer.appendChild(document.body, this.tooltipElement);

    // Calculer la hauteur pour placer au-dessus (ou en dessous si pas assez de place en haut)
    const tooltipRect = (this.tooltipElement as HTMLElement).getBoundingClientRect();
    if (rect.top - tooltipRect.height - 6 >= 0) {
      this.renderer.setStyle(this.tooltipElement, 'top', `${rect.top - tooltipRect.height - 6}px`);
    } else {
      this.renderer.setStyle(this.tooltipElement, 'top', `${rect.bottom + 6}px`);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
