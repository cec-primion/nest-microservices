import { Test } from '@nestjs/testing';
import { UserCreateHandler } from './create.handler';
import { UserCreateCommand } from './create.command';
import { ClientProxy } from '@nestjs/microservices';
import { TestLoggerModule } from '@app/testing';
import { createMock } from '@golevelup/ts-jest';
import { ServiceNameEnum, UsersCommandPatternEnum } from '@app/microservices';
import { of, throwError } from 'rxjs';

describe('UserCreateHandler', () => {
  let handler: UserCreateHandler;
  let clientProxyMock: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    clientProxyMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot()],
      providers: [
        UserCreateHandler,
        {
          provide: ServiceNameEnum.USERS,
          useValue: clientProxyMock,
        },
      ],
    }).compile();

    handler = app.get(UserCreateHandler);
  });

  it('should send event', () => {
    // Arrange
    const email = 'my@test.com';
    const username = 'My-username';
    const departmentId = 'd4fa4040-610d-4637-a3d4-b3b28f0eaa37';

    const commandName = {
      cmd: UsersCommandPatternEnum.USER_CREATE,
    };
    const command = new UserCreateCommand({
      email,
      username,
      departmentId,
    });

    // Act
    handler.execute(command);

    // Assert
    expect(clientProxyMock.send).toHaveBeenCalledWith(commandName, command);
    expect(clientProxyMock.send).toBeCalledTimes(1);
  });

  it('should create user and return id', (done) => {
    // Arrange
    const id = '0ed9d105-d215-41b5-849d-15b8ff6d12c6';
    clientProxyMock.send.mockReturnValue(of({ id }));
    const email = 'my@test.com';
    const username = 'My-username';
    const departmentId = 'd4fa4040-610d-4637-a3d4-b3b28f0eaa37';

    const command = new UserCreateCommand({ email, username, departmentId });

    // Act
    const cut = handler.execute(command);

    cut.subscribe({
      next(value) {
        // Assert
        expect(value).toStrictEqual({ id });
        done();
      },
    });
  });

  it('should throw 409 if user exists for given email', (done) => {
    // Arrange
    const error = { statusCode: 409, message: 'Conflict' };
    clientProxyMock.send.mockReturnValue(throwError(error));

    const email = 'my@test.com';
    const username = 'My-username';
    const departmentId = 'd4fa4040-610d-4637-a3d4-b3b28f0eaa37';

    const command = new UserCreateCommand({ email, username, departmentId });

    // Act
    const cut = handler.execute(command);

    cut.subscribe({
      error(err) {
        expect(err).toStrictEqual(error);
        done();
      },
    });
    expect(clientProxyMock.send).toBeCalledTimes(1);
  });
});
