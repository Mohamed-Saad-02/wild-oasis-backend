import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabinsController } from './cabins.controller';
import { CabinsService } from './cabins.service';
import { CabinEntity } from './entities/cabin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CabinEntity])],
  controllers: [CabinsController],
  providers: [CabinsService],
  exports: [CabinsService],
})
export class CabinsModule {}
