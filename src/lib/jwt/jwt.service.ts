import { Injectable, Logger } from '@nestjs/common';
import { JwtService as _JwtService } from '@nestjs/jwt';

import { ConfigService } from '@lib/configs';

import { JWTConfig } from './jwt.dto';

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);
  private readonly jwtService: _JwtService;
  private readonly config: JWTConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.validate('JWTService', JWTConfig);

    this.jwtService = new _JwtService({
      secret: this.config.JWT_SECRET,
      signOptions: {
        expiresIn: this.config.JWT_ACCESS_EXPIRATION as any
      }
    });

    this.logger.log('JWT Service Initialized');
  }

  sign(payload: any, options?: any): string {
    return this.jwtService.sign(payload, options);
  }

  signAsync(payload: any, options?: any): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  verify<T extends object = any>(token: string, options?: any): T {
    return this.jwtService.verify<T>(token, options);
  }

  verifyAsync<T extends object = any>(token: string, options?: any): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, options);
  }

  decode(token: string, options?: any): any {
    return this.jwtService.decode(token, options);
  }

  getConfig(): JWTConfig {
    return this.config;
  }
}
