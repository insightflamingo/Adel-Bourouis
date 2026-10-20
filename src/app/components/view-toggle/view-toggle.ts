import { Component, model, output } from '@angular/core';

export type ViewMode = 'task' | 'user';

@Component({
  selector: 'app-view-toggle',
  imports: [],
  templateUrl: './view-toggle.html',
  styleUrl: './view-toggle.css',
})
export class ViewToggle {
  readonly activeView = model<ViewMode>('task');
  readonly viewChange = output<ViewMode>();

  selectView(mode: ViewMode): void {
    this.activeView.set(mode);
    this.viewChange.emit(mode);
  }
}
