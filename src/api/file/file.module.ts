import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File } from '@schema/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
