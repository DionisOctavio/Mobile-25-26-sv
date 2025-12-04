import { Test, TestingModule } from '@nestjs/testing';
import { CochesService } from './coches.service';

describe('CochesService', () => {
  let service: CochesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CochesService],
    }).compile();

    service = module.get<CochesService>(CochesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
