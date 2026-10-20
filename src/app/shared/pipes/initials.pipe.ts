import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
})
export class InitialsPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value || !value.trim()) {
      return '?';
    }

    const words = value.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return '?';
    }

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }
}
