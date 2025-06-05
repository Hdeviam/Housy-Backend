import { User } from 'src/entities/user.entity';

/**
 * Clase que simula una capa de acceso a datos para entidades de tipo User.
 * Esta implementación es temporal y se usará únicamente para desarrollo local,
 * hasta que se integre con una base de datos real (por ejemplo, PostgreSQL).
 */
export class UserRepository {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(data: Partial<User>): User {
    const newUser: User = {
      ...data,
      id: Math.floor(Math.random() * 1_000_000_000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  update(id: number, data: Partial<User>): User {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) throw new Error('User not found');

    const updated = {
      ...this.users[index],
      ...data,
      updatedAt: new Date(),
    };

    this.users[index] = updated;
    return updated;
  }

  delete(id: number): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) throw new Error('User not found');
    this.users.splice(index, 1);
  }
}
