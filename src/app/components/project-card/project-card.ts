import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project as ProjectModel } from "../../features/projects/models/project.model";
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
  projectSelected = output<ProjectModel>();

  readonly completionRate = computed<number | null>(() => {
    const tasks = this.project().tasks;
    if (!tasks || tasks.length === 0) return null;
    const completedTasks = tasks.filter(t => t.status === 'Terminé').length;
    return completedTasks / tasks.length;
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
