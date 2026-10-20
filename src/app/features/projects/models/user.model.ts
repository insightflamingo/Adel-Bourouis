export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Développeur' | 'Designer' | 'Chef de projet' | 'Testeur';
  active: boolean;
}