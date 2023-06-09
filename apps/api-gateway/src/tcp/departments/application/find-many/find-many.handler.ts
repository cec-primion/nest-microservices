import { Inject, Injectable } from '@nestjs/common';
import { ServiceNameEnum, IClientProxy, DepartmentsCommandPatternEnum } from '@app/microservices';
import { Observable } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { DepartmentFindManyCommand } from './find-many.command';
import { IDepartment } from '@app/ddd';
import { IDepartmentFindManyHandler } from '../../domain';

@Injectable()
export class DepartmentFindManyHandler implements IDepartmentFindManyHandler {
  constructor(
    @Inject(ServiceNameEnum.DEPARTMENTS) private readonly client: IClientProxy,
    private logger: PinoLogger,
  ) {
    logger.setContext(this.constructor.name);
  }

  execute(command: DepartmentFindManyCommand): Observable<IDepartment[]> {
    console.log('HERE', command);
    this.logger.debug(command, `Processing Find Many`);

    return this.client.send<IDepartment[], DepartmentFindManyCommand>(
      { cmd: DepartmentsCommandPatternEnum.DEPARTMENT_FIND_MANY },
      new DepartmentFindManyCommand(),
    );
  }
}
