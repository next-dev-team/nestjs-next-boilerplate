import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileService } from './file.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { GetUser } from '@common/decorators/get-user.decorator';
import { StorageType } from '@schema/entities/file.entity';

@ApiTags('files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @GetUser('id') userId: string) {
    return this.fileService.uploadFile(file, userId, StorageType.LOCAL);
  }

  @Get()
  @ApiOperation({ summary: 'Get user files' })
  getUserFiles(@GetUser('id') userId: string) {
    return this.fileService.findUserFiles(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  getFile(@Param('id') id: string) {
    return this.fileService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  deleteFile(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.fileService.deleteFile(id, userId);
  }
}
