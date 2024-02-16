import { Test, TestingModule } from '@nestjs/testing';
import { EntityFieldService } from './entity-field.service';

describe('EntityFieldService', () => {
  let service: EntityFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntityFieldService],
    }).compile();

    service = module.get<EntityFieldService>(EntityFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
