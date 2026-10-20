import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { USERS } from '../../features/users/data/users.data';
import { User } from '../../features/projects/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  getUsers(): Observable<User[]> {
    return of(USERS);
  }
  getUserById(id: number): Observable<User | undefined> {
    return of(USERS.find((user) => user.id === id));
  }
}
