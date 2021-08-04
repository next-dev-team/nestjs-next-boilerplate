import { Body, Controller, Get, Post, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { extname } from 'path';

import { Global } from '@common';

import { UploadBody } from './dto/uploads.input.dto';
import { UploadsService } from './uploads.service';
const AWS_S3_BUCKET_NAME = 'ybiz-tech';
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
@Controller('api/uploads')
export class UploadsController {
  constructor(private service: UploadsService) {}
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
  @Post('multi')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: multerS3({
        s3: s3,
        bucket: AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        key: function(_, file, cb) {
          cb(null, `${Date.now().toString()}${extname(file.originalname)}`);
        }
      }),
      fileFilter: Global.imageFileFilter
    })
  )
  uploadFiles(@Body() body: UploadBody, @UploadedFiles() files) {
    const response: any[] = [];
    files.forEach(file => {
      console.log('file:', file);
      const fileResponse = {
        filename: file.key
      };
      response.push(fileResponse);
    });
    console.log('response:', response);
    return response;
  }
  @Post('single')
  async create(@Req() request, @Res() response) {
    try {
      await this.service.fileupload(request, response);
    } catch (error) {
      return response.status(500).json(`Failed to upload image file: ${error.message}`);
    }
  }
}
