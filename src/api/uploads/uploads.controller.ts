import { Controller, Get, Post, Req, Res } from '@nestjs/common';

import { UploadsService } from './uploads.service';
@Controller('api/uploads')
export class UploadsController {
  constructor(private service: UploadsService) {}
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }

  @Post('single')
  async create(@Req() request, @Res() response) {
    try {
      await this.service.fileupload(request, response);
    } catch (error) {
      // @ts-ignore
      return response.status(500).json(`Failed to upload image file: ${error.message}`);
    }
  }
}
