import { Component, computed, input, output, signal } from '@angular/core';
import { Task as TaskModel } from "../../features/projects/models/task.model";
import { User } from '../../features/projects/models/user.model';
import { TaskItem } from '../../features/projects/components/task-item/task-item';

export type TaskFilter = 'Toutes' | 'En cours' | 'Terminé';

@Component({
  imports: [TaskItem],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  readonly tasks = input.required<TaskModel[]>();
  readonly showAssignee = input<boolean>(true);
  readonly projectId = input<number>();
  readonly users = input<User[]>([]);

  readonly taskStatusChange = output<{ taskId: number; newStatus: TaskModel['status']; projectId?: number }>();
  readonly taskDelete = output<{ taskId: number; projectId?: number }>();

  readonly statusFilter = signal<TaskFilter>('Toutes');

  readonly inProgressCount = computed<number>(() =>
    this.tasks().filter((t) => t.status === 'En cours').length
  );

  readonly completedCount = computed<number>(() =>
    this.tasks().filter((t) => t.status === 'Terminé').length
  );

  readonly filteredTasks = computed<TaskModel[]>(() => {
    const filter = this.statusFilter();
    const list = this.tasks();
    if (filter === 'Toutes') {
      return list;
    }
    return list.filter((t) => t.status === filter);
  });

  setFilter(filter: TaskFilter): void {
    this.statusFilter.set(filter);
  }

  getAssigneeName(assigneeId?: number): string | undefined {
    if (!assigneeId) return undefined;
    return this.users().find((u) => u.id === assigneeId)?.name;
  }

  onTaskStatusChange(taskId: number, newStatus: TaskModel['status']): void {
    this.taskStatusChange.emit({
      taskId,
      newStatus,
      projectId: this.projectId(),
    });
  }

  onTaskDelete(taskId: number): void {
    this.taskDelete.emit({
      taskId,
      projectId: this.projectId(),
    });
  }
}
