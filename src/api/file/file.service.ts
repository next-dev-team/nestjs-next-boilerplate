import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, StorageType } from '@schema/entities/file.entity';
import { StorageService } from '@lib/storage/storage.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private storageService: StorageService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    storageType: StorageType = StorageType.LOCAL,
  ) {
    const uploadResult = await this.storageService.upload(file, storageType);

    const fileEntity = this.fileRepository.create({
      userId,
      originalName: file.originalname,
      filename: uploadResult.filename,
      mimeType: file.mimetype,
      size: file.size,
      storageType: uploadResult.storageType,
      path: uploadResult.path,
      url: uploadResult.url,
    });

    return this.fileRepository.save(fileEntity);
  }

  async findOne(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async findUserFiles(userId: string) {
    return this.fileRepository.find({ where: { userId } });
  }

  async deleteFile(id: string, userId: string) {
    const file = await this.findOne(id);

    if (file.userId !== userId) {
      throw new NotFoundException('File not found');
    }

    await this.storageService.delete(file.path, file.storageType);
    return this.fileRepository.softRemove(file);
  }
}
