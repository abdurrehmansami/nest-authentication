import { BadRequestException, Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // Example limit (5MB)
      fileFilter: (req, file, cb) => {
        // Custom file type validation
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|plain)$/)) {
          return cb(new BadRequestException('Unsupported file type!'), false); // Reject the file upload
        }
        cb(null, true); // Accept the file
      },
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
