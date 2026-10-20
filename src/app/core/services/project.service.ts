import { Injectable, signal, Signal } from '@angular/core';
import { Project as ProjectModel } from '../../features/projects/models/project.model';
import { ProjectsData } from '../../features/projects/data/projects.data';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Project {
    getProjects(): Observable<ProjectModel[]> {
    return of(ProjectsData);
  }
}