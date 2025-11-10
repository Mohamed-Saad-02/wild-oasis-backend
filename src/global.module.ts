import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConstantsService } from './common/constants';
import { AuthGuard, RoleGuard } from './common/guards';
import { UploadCloudFileService } from './common/services';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [UsersModule],
  providers: [ConstantsService, UploadCloudFileService, AuthGuard, RoleGuard],
  exports: [
    ConstantsService,
    UploadCloudFileService,
    AuthGuard,
    RoleGuard,
    UsersModule,
  ],
})
export class GlobalModule {}
