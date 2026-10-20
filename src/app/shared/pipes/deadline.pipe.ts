import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deadline',
})
export class DeadlinePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, status?: string): string {
    if (status === 'Terminé') {
      return 'Terminée';
    }

    if (!value) {
      return 'Pas d’échéance';
    }

    const targetDate = typeof value === 'string' ? new Date(value) : new Date(value.getTime());
    if (isNaN(targetDate.getTime())) {
      return 'Pas d’échéance';
    }

    const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.round((targetDay.getTime() - today.getTime()) / msPerDay);

    if (diffDays === 0) {
      return 'Aujourd’hui';
    } else if (diffDays === 1) {
      return 'Demain';
    } else if (diffDays > 1) {
      return `Dans ${diffDays} jours`;
    } else {
      const pastDays = Math.abs(diffDays);
      return pastDays === 1 ? 'En retard de 1 jour' : `En retard de ${pastDays} jours`;
    }
  }
}
