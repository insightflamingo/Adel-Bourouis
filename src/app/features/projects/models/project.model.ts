import { Task } from "./task.model";

export interface Project {
    id: number,
    name: string,
    description: string,
    status : "En attente" | "En cours" | "Terminé",
    tasks: Task[],
    startDate: string,
    budget: number,
}