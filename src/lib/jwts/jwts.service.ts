import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtsService {
  constructor(private jwtService: JwtService) {}

  async createToken(params: any) {
    const payload = { ...params, dt: new Date().getTime() };
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
  async decodeToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync<any>(token);
  }
}
