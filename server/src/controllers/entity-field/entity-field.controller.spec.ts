import { Test, TestingModule } from '@nestjs/testing';
import { EntityFieldController } from './entity-field.controller';

describe('EntityFieldController', () => {
  let controller: EntityFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntityFieldController],
    }).compile();

    controller = module.get<EntityFieldController>(EntityFieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
