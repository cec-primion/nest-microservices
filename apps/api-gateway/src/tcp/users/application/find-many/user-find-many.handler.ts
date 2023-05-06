import { Inject, Injectable } from '@nestjs/common';
import { ServiceNameEnum, UsersCommandPatternEnum } from '@app/microservices';
import { Observable } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { UserFindManyCommand } from './user-find-many.command';
import { IClientProxy } from '../../domain';
import { IUser } from '@app/ddd';

@Injectable()
export class UserFindManyHandler {
  constructor(
    @Inject(ServiceNameEnum.USERS) private readonly usersClient: IClientProxy,
    private logger: PinoLogger,
  ) {
    logger.setContext(this.constructor.name);
  }

  findMany(command: UserFindManyCommand): Observable<IUser[]> {
    this.logger.debug(command, `Processing Find Many`);

    return this.usersClient.send<IUser[], UserFindManyCommand>(
      { cmd: UsersCommandPatternEnum.USER_FIND_MANY },
      new UserFindManyCommand(),
    );
  }
}