import { Inject, Injectable } from '@nestjs/common';
import { ServiceNameEnum, UsersCommandPatternEnum, IClientProxy } from '@app/microservices';
import { Observable } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { UserFindOneCommand } from './find-one.command';
import { IUser } from '@app/ddd';
import { IUserFindOneHandler } from '../../domain';

@Injectable()
export class UserFindOneHandler implements IUserFindOneHandler {
  constructor(
    @Inject(ServiceNameEnum.USERS) private readonly client: IClientProxy,
    private logger: PinoLogger,
  ) {
    logger.setContext(this.constructor.name);
  }

  execute(command: UserFindOneCommand): Observable<IUser> {
    this.logger.debug(command, `Processing Find One`);

    return this.client.send<IUser, UserFindOneCommand>(
      { cmd: UsersCommandPatternEnum.USER_FIND_ONE },
      new UserFindOneCommand({
        id: command.id,
        departmentId: command.departmentId,
      }),
    );
  }
}
