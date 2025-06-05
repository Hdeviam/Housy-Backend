import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository'; // 👈 Ruta relativa correcta

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll(): User[] {
    return this.userRepository.findAll();
  }

  findOne(id: number): User {
    const user = this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): User {
    return this.userRepository.create(createUserDto);
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number): void {
    this.userRepository.delete(id);
  }
}
