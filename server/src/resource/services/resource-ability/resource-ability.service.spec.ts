import { Test, TestingModule } from '@nestjs/testing';
import { ResourceAbilityService } from './resource-ability.service';

describe('ResourceAbilityService', () => {
  let service: ResourceAbilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceAbilityService],
    }).compile();

    service = module.get<ResourceAbilityService>(ResourceAbilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
