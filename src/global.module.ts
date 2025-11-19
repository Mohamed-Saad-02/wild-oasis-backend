import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConstantsService } from './common/constants';
import { UploadCloudFileService } from './common/services';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [UsersModule],
  providers: [ConstantsService, UploadCloudFileService],
  exports: [ConstantsService, UploadCloudFileService, UsersModule],
})
export class GlobalModule {}
