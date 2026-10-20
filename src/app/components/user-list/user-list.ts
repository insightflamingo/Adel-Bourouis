import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Project as ProjectService } from '../../core/services/project.service';
import { User } from '../../features/projects/models/user.model';
import { Project as ProjectModel } from '../../features/projects/models/project.model';
import { UserCard } from '../user-card/user-card';
import { EmptyState } from '../empty-state/empty-state';
import { UserProjectGroup } from '../user-project-group/user-project-group';

@Component({
  selector: 'app-user-list',
  imports: [UserCard, EmptyState, FormsModule, UserProjectGroup],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  protected readonly userService = inject(UserService);
  protected readonly projectService = inject(ProjectService);

  readonly users = signal<User[]>([]);
  readonly projects = signal<ProjectModel[]>([]);
  readonly searchQuery = signal('');
  readonly selectedUser = signal<User | null>(null);

  constructor() {
    this.userService.getUsers().subscribe((users) => {
      this.users.set(users);
    });

    this.projectService.getProjects().subscribe((projects) => {
      this.projects.set(projects);
    });
  }

  readonly filteredUsers = computed<User[]>(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.users();
    }

    return this.users().filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  });

  getUserProjects(userId: number): ProjectModel[] {
    return this.projects().filter((project) =>
      project.tasks?.some((task) => task.assigneeId === userId)
    );
  }

  onUserSelected(user: User): void {
    this.selectedUser.set(user);
    console.log('Utilisateur sélectionné :', user);
  }
}
