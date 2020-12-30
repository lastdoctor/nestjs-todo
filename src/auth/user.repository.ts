import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = authCredentialDto;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User();

      user.username = username;
      user.password = hashedPassword;
      user.salt = salt;

      await user.save();
    } catch (e) {
      if (e.code === '23505')
        throw new ConflictException('User already exists');
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (!user) throw new NotFoundException();
    const isSame = await user.validatePassword(password);
    if (!isSame) throw new BadRequestException('Password is not validate');
    return username;
  }
}
