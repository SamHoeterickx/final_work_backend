import { Test, TestingModule } from '@nestjs/testing';
import { LessonsResolver } from './lessons.resolver';

describe('LessonsResolver', () => {
  let resolver: LessonsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonsResolver],
    }).compile();

    resolver = module.get<LessonsResolver>(LessonsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
