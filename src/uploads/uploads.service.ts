import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  // AWS S3 업로드 (선택사항)
  async uploadToS3(file: Express.Multer.File): Promise<string> {
    // AWS S3 SDK를 사용한 업로드 로직
    // 프로덕션 환경에서 구현
    return 'https://s3.amazonaws.com/bucket/filename';
  }
}
