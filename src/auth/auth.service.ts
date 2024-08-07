import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDto } from './auth.dto';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private jwtExpirationTimeInSeconds: number;
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    );
  }

  signIn(username: string, password: string): AuthResponseDto {
    const foudUser = this.usersService.findByUserName(username);

    if (!foudUser || !bcryptCompareSync(password, foudUser.password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: foudUser.id, username: foudUser.username };

    const token = this.jwtService.sign(payload);

    return { token, expirenIn: this.jwtExpirationTimeInSeconds };
  }
}
