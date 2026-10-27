import { Component, input, output } from '@angular/core';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { Task } from '../../models/task.model';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { DeadlinePipe } from '../../../../shared/pipes/deadline.pipe';
import { HighlightDirective } from '../../../../shared/directives/highlight.directive';
import { OverdueDirective } from '../../../../shared/directives/overdue.directive';
import { TooltipDirective } from '../../../../shared/directives/tooltip.directive';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    NgStyle,
    TruncatePipe,
    DeadlinePipe,
    HighlightDirective,
    OverdueDirective,
    TooltipDirective,
  ],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  readonly task = input.required<Task>();
  readonly showAssignee = input<boolean>(true);
  readonly assigneeName = input<string>();

  readonly taskStatusChange = output<Task['status']>();
  readonly taskDelete = output<number>();

  deleteTask(): void {
    this.taskDelete.emit(this.task().id);
  }

  changeStatus(): void {
    const current = this.task().status;
    let next: Task['status'];
    if (current === 'En attente') {
      next = 'En cours';
    } else if (current === 'En cours') {
      next = 'Terminé';
    } else {
      next = 'En attente';
    }
    this.taskStatusChange.emit(next);
  }

  get deadlineIndicatorColor(): string {
    const t = this.task();
    if (t.status === 'Terminé') {
      return '#22c55e'; // vert pour terminé
    }
    if (!t.dueDate) {
      return '#94a3b8'; // gris ardoise si pas d'échéance
    }
    const due = new Date(t.dueDate);
    if (isNaN(due.getTime())) {
      return '#94a3b8';
    }
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffDays = Math.round((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return '#ef4444'; // rouge si en retard
    } else if (diffDays <= 7) {
      return '#f59e0b'; // orange si dans moins d'une semaine
    } else {
      return '#3b82f6'; // bleu si échéance confortable
    }
  }

  isOverdue(): boolean {
    const t = this.task();
    if (t.status === 'Terminé' || !t.dueDate) return false;
    const due = new Date(t.dueDate);
    if (isNaN(due.getTime())) return false;
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return dueDay.getTime() < today.getTime();
  }
}
