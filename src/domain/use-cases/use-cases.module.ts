import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { CreateUserService } from './create-user.service';

@Module({
  imports: [InfrastructureModule],
  providers: [CreateUserService],
  exports: [CreateUserService], 
})
export class UseCasesModule {}
