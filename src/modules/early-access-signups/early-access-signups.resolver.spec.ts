import { Test, TestingModule } from '@nestjs/testing';
import { EarlyAccessSignupsResolver } from './early-access-signups.resolver';

describe('EarlyAccessSignupsResolver', () => {
  let resolver: EarlyAccessSignupsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarlyAccessSignupsResolver],
    }).compile();

    resolver = module.get<EarlyAccessSignupsResolver>(EarlyAccessSignupsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
