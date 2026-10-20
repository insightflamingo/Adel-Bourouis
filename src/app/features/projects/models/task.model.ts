export interface Task {
    id: number;
    title: string;
    priority: 'Haute' | 'Moyenne' | 'Basse';
    status: "En attente" | "En cours" | "Terminé";
    assigneeId?: number;
    dueDate?: string;
    description?: string;
}