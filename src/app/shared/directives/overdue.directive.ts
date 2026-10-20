import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appOverdue]',
})
export class OverdueDirective {
  @Input() dueDate?: string | null;
  @Input() done: boolean = false;

  @HostBinding('class.border-red-500')
  @HostBinding('class.bg-red-50')
  get isOverdue(): boolean {
    if (this.done || !this.dueDate) {
      return false;
    }

    const due = new Date(this.dueDate);
    if (isNaN(due.getTime())) {
      return false;
    }

    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return dueDay.getTime() < today.getTime();
  }
}
