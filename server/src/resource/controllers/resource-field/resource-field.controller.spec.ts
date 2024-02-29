import { Test, TestingModule } from '@nestjs/testing';
import { ResourceFieldController } from './resource-field.controller';

describe('ResourceFieldController', () => {
  let controller: ResourceFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceFieldController],
    }).compile();

    controller = module.get<ResourceFieldController>(ResourceFieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
