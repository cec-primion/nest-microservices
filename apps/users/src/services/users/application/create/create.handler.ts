import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserCreateCommand } from './create.command';
import { UserFixture } from '../../domain/entity-fixtures';
import { IUserCreateHandler, IUsersCommandRepository, UserCreatedEvent } from '../../domain';
import { RpcException } from '@nestjs/microservices';
import { IClientProxy, UsersEventPatternEnum, ServiceNameEnum } from '@app/microservices';

@Injectable()
export class UserCreateHandler implements IUserCreateHandler {
  constructor(
    private readonly usersCommandRepository: IUsersCommandRepository,
    private logger: PinoLogger,
    @Inject(ServiceNameEnum.RABBIT_MQ) private readonly client: IClientProxy,
  ) {
    logger.setContext(this.constructor.name);
  }

  async execute(command: UserCreateCommand): Promise<{ id: string }> {
    this.logger.debug(command, `Processing Create User`);

    const exist = await this.usersCommandRepository.findOne({
      where: [
        { username: command.username },
        {
          email: command.email,
        },
      ],
    });

    if (exist) {
      throw new RpcException({
        statusCode: 409,
        message: 'User for given email or username already exists!',
      });
    }

    const user = UserFixture.create(command);

    await this.usersCommandRepository.save(user);

    // EMit to Rabbig Mq
    this.client.emit<UsersEventPatternEnum, { id: string; departmentId: string }>(
      UsersEventPatternEnum.USER_CREATED,
      new UserCreatedEvent({
        id: user.id,
        departmentId: user.departmentId,
      }),
    );

    return { id: user.id };
  }
}
