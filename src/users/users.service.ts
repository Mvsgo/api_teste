import { ConflictException, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository } from 'typeorm';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(newUser: UserDto) {
    const userExist = await this.findByUserName(newUser.username);

    if (userExist) {
      throw new ConflictException(
        'Usuario ${newUser.username} ja foiregistrado',
      );
    }

    const dbUser = new UserEntity();
    dbUser.username = newUser.username;

    dbUser.passwordHash = bcryptHashSync(newUser.password, 10);

    const { id, username } = await this.userRepository.save(dbUser);

    return { id, username };
  }
  async findByUserName(username: string): Promise<UserDto> | null {
    const userFound = await this.userRepository.findOne({
      where: { username },
    });
    if (!userFound) {
      return null;
    }

    return {
      id: userFound.id,
      username: userFound.username,
      password: userFound.passwordHash,
    };
  }
}
