import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserFindManyCommand } from './user-find-many.command';
import { IUser } from '@app/ddd';
import { IUsersQueryRepository } from '../../domain';

@Injectable()
export class UserFindManyHandler {
  constructor(
    private readonly usersQueryRepository: IUsersQueryRepository,
    private logger: PinoLogger,
  ) {
    logger.setContext(this.constructor.name);
  }

  async findMany(command: UserFindManyCommand): Promise<IUser[]> {
    this.logger.debug(command, `Processing Find Many`);

    const users = await this.usersQueryRepository.findMany();

    return users;
  }
}