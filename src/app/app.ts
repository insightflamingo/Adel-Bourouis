import { Component, signal } from '@angular/core';
import { ProjectList } from './components/project-list/project-list';
import { UserList } from './components/user-list/user-list';
import { ViewToggle, ViewMode } from './components/view-toggle/view-toggle';

@Component({
  selector: 'app-root',
  imports: [ProjectList, UserList, ViewToggle],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('TaskFlow');
  protected readonly currentView = signal<ViewMode>('task');
}
