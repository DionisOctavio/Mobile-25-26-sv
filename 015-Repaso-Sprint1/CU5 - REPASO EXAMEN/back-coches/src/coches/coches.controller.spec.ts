import { Test, TestingModule } from '@nestjs/testing';
import { CochesController } from './coches.controller';

describe('CochesController', () => {
  let controller: CochesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CochesController],
    }).compile();

    controller = module.get<CochesController>(CochesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
