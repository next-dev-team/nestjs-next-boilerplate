import { Test, TestingModule } from '@nestjs/testing';
import { PwdService } from './pwd.service';

describe('PwdService', () => {
  let service: PwdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PwdService],
    }).compile();

    service = module.get<PwdService>(PwdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
