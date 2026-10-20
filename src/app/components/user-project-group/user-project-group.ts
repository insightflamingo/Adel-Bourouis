import { Component, computed, inject, input, signal } from '@angular/core';
import { TaskList } from '../task-list/task-list';
import { Project as ProjectModel } from '../../features/projects/models/project.model';
import { Task as TaskModel } from '../../features/projects/models/task.model';
import { User } from '../../features/projects/models/user.model';
import { Project as ProjectService } from '../../core/services/project.service';

export interface ProjectTaskGroup {
  projectId: number;
  projectName: string;
  projectStatus: string;
  tasks: TaskModel[];
  taskCount: number;
}

@Component({
  selector: 'app-user-project-group',
  imports: [TaskList],
  templateUrl: './user-project-group.html',
  styleUrl: './user-project-group.css',
})
export class UserProjectGroup {
  private readonly projectService = inject(ProjectService);
  private readonly allProjects = signal<ProjectModel[]>([]);

  readonly user = input<User>();
  readonly userId = input<number>();
  readonly projects = input<ProjectModel[]>();

  constructor() {
    this.projectService.getProjects().subscribe((projects) => {
      this.allProjects.set(projects);
    });
  }

  readonly projectGroups = computed<ProjectTaskGroup[]>(() => {
    const currentUserId = this.user()?.id ?? this.userId();
    if (currentUserId === undefined) {
      return [];
    }

    const sourceProjects = this.projects() ?? this.allProjects();

    return sourceProjects
      .map((proj) => {
        const userTasks = (proj.tasks ?? []).filter((t) => t.assigneeId === currentUserId);
        return {
          projectId: proj.id,
          projectName: proj.name,
          projectStatus: proj.status,
          tasks: userTasks,
          taskCount: userTasks.length,
        };
      })
      .filter((group) => group.taskCount > 0);
  });
}
