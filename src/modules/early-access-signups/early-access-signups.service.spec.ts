import { Test, TestingModule } from '@nestjs/testing';
import { EarlyAccessSignupsService } from './early-access-signups.service';

describe('EarlyAccessSignupsService', () => {
  let service: EarlyAccessSignupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EarlyAccessSignupsService],
    }).compile();

    service = module.get<EarlyAccessSignupsService>(EarlyAccessSignupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
