import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project as ProjectModel } from "../../features/projects/models/project.model";
import { Task as TaskModel } from "../../features/projects/models/task.model";
import { User } from '../../features/projects/models/user.model';
import { TaskList } from '../task-list/task-list';
import { HighlightDirective } from '../../shared/directives/highlight.directive';

@Component({
  imports: [CommonModule, TaskList, HighlightDirective],
  selector: 'app-project-card',
  styleUrl: './project-card.css',
  templateUrl: './project-card.html',
})
export class ProjectCard {
  readonly project = input.required<ProjectModel>();
  readonly users = input<User[]>([]);
  projectSelected = output<ProjectModel>();

  readonly taskStatusChange = output<{ projectId: number; taskId: number; newStatus: TaskModel['status'] }>();
  readonly taskDelete = output<{ projectId: number; taskId: number }>();

  onTaskStatusChange(event: { taskId: number; newStatus: TaskModel['status']; projectId?: number }): void {
    this.taskStatusChange.emit({
      projectId: this.project().id,
      taskId: event.taskId,
      newStatus: event.newStatus,
    });
  }

  onTaskDelete(event: { taskId: number; projectId?: number }): void {
    this.taskDelete.emit({
      projectId: this.project().id,
      taskId: event.taskId,
    });
  }

  readonly completedTasksCount = computed<number>(() => {
    const tasks = this.project().tasks;
    if (!tasks || tasks.length === 0) return 0;
    return tasks.filter((t) => t.status === 'Terminé').length;
  });

  readonly completionRate = computed<number | null>(() => {
    const tasks = this.project().tasks;
    if (!tasks || tasks.length === 0) return null;
    return this.completedTasksCount() / tasks.length;
  });

  readonly averageCostPerTask = computed<number | null>(() => {
    const tasks = this.project().tasks;
    if (!tasks || tasks.length === 0) return null;
    return this.project().budget / tasks.length;
  });

  readonly tasksByPriority = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = {
      Basse: 0,
      Haute: 0,
      Moyenne: 0,
    };
    for (const task of this.project().tasks) {
      if (counts[task.priority] !== undefined) {
        counts[task.priority]++;
      } else {
        counts[task.priority] = 1;
      }
    }
    return counts;
  });

  get barColor(): string {
    const rate = this.completionRate();
    if (rate === null || rate < 0.34) {
      return '#ef4444'; // rouge sous 34 %
    } else if (rate <= 0.66) {
      return '#f59e0b'; // orange jusqu'à 66 %
    } else {
      return '#22c55e'; // vert au-delà
    }
  }

  selectProject(): void {
    this.projectSelected.emit(this.project());
  }
}
