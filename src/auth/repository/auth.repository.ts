import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  /**
   * Busca un usuario por correo electrónico.
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.findOneBy({ email }); // 👈 Devuelve User | null
    return user || undefined; // 👈 Convierte null a undefined
  }

  /**
   * Crea y guarda un nuevo usuario.
   */
  createUser(user: Partial<User>): Promise<User> {
    const newUser = this.create(user);
    return this.save(newUser);
  }
}
