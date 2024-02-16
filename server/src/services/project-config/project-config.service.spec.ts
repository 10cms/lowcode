import { Test, TestingModule } from '@nestjs/testing';
import { ProjectConfigService } from './project-config.service';

describe('ProjectConfigService', () => {
  let service: ProjectConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectConfigService],
    }).compile();

    service = module.get<ProjectConfigService>(ProjectConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
