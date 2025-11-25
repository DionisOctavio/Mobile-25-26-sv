import { Controller, Post, Body } from '@nestjs/common';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly service: UploadsService) {}

  @Post('presign')
  getPresigned(@Body() body: { filename: string; type: string }) {
    return this.service.getPresignedUrl(body.filename, body.type);
  }
}
