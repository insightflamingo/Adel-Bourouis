import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project as ProjectService } from '../../core/services/project.service';
import { UserService } from '../../core/services/user.service';
import { Project as ProjectModel } from '../../features/projects/models/project.model';
import { Task as TaskModel } from '../../features/projects/models/task.model';
import { User } from '../../features/projects/models/user.model';
import { ProjectCard } from '../project-card/project-card';

@Component({
  imports: [ProjectCard, FormsModule],
  selector: 'app-project-list',
  styleUrl: './project-list.css',
  templateUrl: './project-list.html',
})
export class ProjectList {
  protected readonly projectService = inject(ProjectService);
  protected readonly userService = inject(UserService);

  protected readonly projects = signal<ProjectModel[]>([]);
  readonly users = signal<User[]>([]);

  constructor() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects.set(projects);
    });

    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  readonly searchQuery = signal('');

  readonly filteredProjects = computed<ProjectModel[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.projects();
    }

    return this.projects().filter((project) =>
      project.name.toLowerCase().includes(query)
    );
  });

  onProjectSelected(project: ProjectModel): void {
    console.log(project);
  }

  onTaskStatusChange(event: { projectId: number; taskId: number; newStatus: TaskModel['status'] }): void {
    this.projects.update((currentProjects) =>
      currentProjects.map((p) => {
        if (p.id !== event.projectId) {
          return p;
        }

        const updatedTasks = p.tasks.map((t) => {
          if (t.id === event.taskId) {
            return { ...t, status: event.newStatus };
          }
          return t;
        });

        return {
          ...p,
          tasks: updatedTasks,
        };
      })
    );
  }

  onTaskDelete(event: { projectId: number; taskId: number }): void {
    this.projects.update((currentProjects) =>
      currentProjects.map((p) => {
        if (p.id !== event.projectId) {
          return p;
        }

        return {
          ...p,
          tasks: p.tasks.filter((t) => t.id !== event.taskId),
        };
      })
    );
  }
}