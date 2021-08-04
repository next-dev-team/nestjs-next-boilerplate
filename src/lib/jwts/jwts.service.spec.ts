import { Test, TestingModule } from '@nestjs/testing';
import { JwtsService } from './jwts.service';

describe('JwtsService', () => {
  let service: JwtsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtsService],
    }).compile();

    service = module.get<JwtsService>(JwtsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
