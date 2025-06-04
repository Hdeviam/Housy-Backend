import { User } from '../entities/user.entity';

/**
 * Clase que simula una capa de acceso a datos para entidades de tipo User.
 * Esta implementación es temporal y se usará únicamente para desarrollo local,
 * hasta que se integre con una base de datos real (por ejemplo, PostgreSQL).
 */
export class UserRepository {
  private readonly users: User[] = [];

  /**
   * Obtiene todos los usuarios almacenados en memoria.
   * @returns Array de objetos User
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * Busca un usuario por su ID.
   * @param id - Identificador único del usuario
   * @returns Objeto User si existe, undefined si no
   */
  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  /**
   * Crea un nuevo usuario a partir de los datos proporcionados.
   * Asigna un ID temporal aleatorio y registra fechas de creación y actualización.
   * @param data - Datos iniciales del usuario
   * @returns El usuario creado
   */
  create(data: Partial<User>): User {
    const defaultUser: User = {
      email: '',
      name: '',
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newUser: User = {
      ...defaultUser,
      ...data,
      id: Math.floor(Math.random() * 1_000_000_000), // ID temporal simulado
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
