import { Module } from '@nestjs/common';
import { UserRepositoryOrm } from './repository/user-repository-orm';

@Module({
  exports: [UserRepositoryOrm],
  imports: [],
  providers: [],
})
export class InfrastructureModule {}
