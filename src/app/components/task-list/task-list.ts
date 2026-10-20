import { Component, inject, input, signal } from '@angular/core';
import { Task as TaskModel } from "../../features/projects/models/task.model";
import { UserService } from '../../core/services/user.service';
import { User } from '../../features/projects/models/user.model';

import { DatePipe, NgClass } from '@angular/common';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { DeadlinePipe } from '../../shared/pipes/deadline.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { OverdueDirective } from '../../shared/directives/overdue.directive';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
  imports: [DatePipe, NgClass, TruncatePipe, DeadlinePipe, HighlightDirective, OverdueDirective, TooltipDirective],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  private readonly userService = inject(UserService);
  private readonly users = signal<User[]>([]);

  readonly tasks = input.required<TaskModel[]>();
  readonly showAssignee = input<boolean>(true);

  constructor() {
    this.userService.getUsers().subscribe((users) => {
      this.users.set(users);
    });
  }

  getAssigneeName(assigneeId?: number): string | undefined {
    if (!assigneeId) return undefined;
    return this.users().find((u) => u.id === assigneeId)?.name;
  }

  isTaskOverdue(task: TaskModel): boolean {
    if (task.status === 'Terminé' || !task.dueDate) return false;
    const due = new Date(task.dueDate);
    if (isNaN(due.getTime())) return false;
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return dueDay.getTime() < today.getTime();
  }
}
