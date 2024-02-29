import { Test, TestingModule } from '@nestjs/testing';
import { ResourceFieldService } from './resource-field.service';

describe('ResourceFieldService', () => {
  let service: ResourceFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceFieldService],
    }).compile();

    service = module.get<ResourceFieldService>(ResourceFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
