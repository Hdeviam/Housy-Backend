import { User } from 'src/entities/user.entity';

/**
 * Clase que simula una capa de acceso a datos para entidades de tipo User.
 * Esta implementación es temporal y se usará únicamente para desarrollo local,
 * hasta que se integre con una base de datos real (por ejemplo, PostgreSQL).
 */
export class AuthRepository {
  private users: User[] = [];

  /**
   * Busca un usuario por su correo electrónico.
   * @param email - Correo del usuario
   * @returns El usuario encontrado o undefined si no existe
   */
  findUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  /**
   * Crea un nuevo usuario a partir de los datos proporcionados.
   * Asigna un ID temporal aleatorio y registra fechas de creación y actualización.
   * @param data - Datos iniciales del usuario
   * @returns El usuario creado
   */
  createUser(data: Partial<User>): User {
    const defaultUser: User = {
      id: Math.floor(Math.random() * 1_000_000_000),
      email: '',
      name: '',
      password: '',
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newUser: User = {
      ...defaultUser,
      ...data,
      id: Math.floor(Math.random() * 1_000_000_000), // Aseguramos siempre un ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Actualiza un usuario existente con nuevos datos.
   * @param id - Identificador único del usuario
   * @param data - Nuevos datos parciales del usuario
   * @throws Error si el usuario no se encuentra
   * @returns El usuario actualizado
   */
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

  /**
   * Elimina un usuario por su ID.
   * @param id - Identificador único del usuario
   * @throws Error si el usuario no se encuentra
   */
  delete(id: number): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) throw new Error('User not found');
    this.users.splice(index, 1);
  }
}
