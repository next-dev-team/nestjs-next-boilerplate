import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from './emails.service';

describe('EmailsService', () => {
  let service: EmailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailsService],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
