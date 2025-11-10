import { Test, TestingModule } from '@nestjs/testing';
import { CabinsController } from './cabins.controller';
import { CabinsService } from './cabins.service';

describe('CabinsController', () => {
  let controller: CabinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CabinsController],
      providers: [CabinsService],
    }).compile();

    controller = module.get<CabinsController>(CabinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
