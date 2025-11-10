import { Test, TestingModule } from '@nestjs/testing';
import { CabinsService } from './cabins.service';

describe('CabinsService', () => {
  let service: CabinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CabinsService],
    }).compile();

    service = module.get<CabinsService>(CabinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
