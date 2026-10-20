import { Component, computed, inject, input, output, signal } from '@angular/core';
import { User } from '../../features/projects/models/user.model';
import { Project as ProjectModel } from '../../features/projects/models/project.model';
import { Task as TaskModel } from '../../features/projects/models/task.model';
import { UserProjectGroup } from '../user-project-group/user-project-group';
import { EmptyState } from '../empty-state/empty-state';
import { Project as ProjectService } from '../../core/services/project.service';

import { LowerCasePipe, NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';

@Component({
  selector: 'app-user-card',
  imports: [UserProjectGroup, EmptyState, TitleCasePipe, LowerCasePipe, InitialsPipe, NgClass, NgStyle, HighlightDirective],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  readonly roleColors: Record<string, string> = {
    'Développeur': '#3b82f6', // bleu
    'Designer': '#a855f7',    // violet
    'Chef de projet': '#f59e0b', // ambre / orange
    'Testeur': '#14b8a6',     // sarcelle
  };

  private readonly projectService = inject(ProjectService);
  private readonly defaultProjects = signal<ProjectModel[]>([]);

  readonly user = input.required<User>();
  readonly projects = input<ProjectModel[]>();

  userSelected = output<User>();

  constructor() {
    this.projectService.getProjects().subscribe((projects) => {
      this.defaultProjects.set(projects);
    });
  }

  readonly effectiveProjects = computed<ProjectModel[]>(() => {
    const p = this.projects();
    return p && p.length > 0 ? p : this.defaultProjects();
  });

  readonly userTasks = computed<TaskModel[]>(() => {
    const userId = this.user().id;
    const tasks: TaskModel[] = [];
    for (const project of this.effectiveProjects()) {
      for (const task of project.tasks ?? []) {
        if (task.assigneeId === userId) {
          tasks.push(task);
        }
      }
    }
    return tasks;
  });

  readonly pendingCount = computed(() =>
    this.userTasks().filter((t) => t.status === 'En attente').length
  );

  readonly inProgressCount = computed(() =>
    this.userTasks().filter((t) => t.status === 'En cours').length
  );

  readonly completedCount = computed(() =>
    this.userTasks().filter((t) => t.status === 'Terminé').length
  );

  selectUser(): void {
    this.userSelected.emit(this.user());
  }
}
