import { User } from "../../projects/models/user.model";

export const USERS: User[] = [
  {
    id: 1,
    name: 'Amira Ben Salah',
    email: 'amira@taskflow.tn',
    role: 'Développeur',
    active: true,
  },
  {
    id: 2,
    name: 'Mohamed Trabelsi',
    email: 'mohamed@taskflow.tn',
    role: 'Chef de projet',
    active: true,
  },
  {
    id: 3,
    name: 'Syrine Mansour',
    email: 'syrine@taskflow.tn',
    role: 'Designer',
    active: true,
  },
  {
    id: 4,
    name: 'Yassine Gharbi',
    email: 'yassine@taskflow.tn',
    role: 'Testeur',
    active: false,
  },
];