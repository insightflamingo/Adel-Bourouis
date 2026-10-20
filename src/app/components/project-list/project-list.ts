import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Project as ProjectService } from '../../core/services/project.service';
import { Project as ProjectModel } from '../../features/projects/models/project.model';
import { ProjectCard } from '../project-card/project-card';

@Component({
  imports: [ProjectCard, FormsModule],
  selector: 'app-project-list',
  styleUrl: './project-list.css',
  templateUrl: './project-list.html',
})
export class ProjectList {
  protected readonly projectService = inject(ProjectService);
  protected readonly projects = signal<ProjectModel[]>([]);

  constructor() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects.set(projects);
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
}