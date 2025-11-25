import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadsService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  /**
   * Obtiene una URL presignada para subir una imagen con permisos públicos.
   */
  async getPresignedUrl(filename: string, type: string) {
    const bucket = process.env.AWS_BUCKET_NAME!;
    const region = process.env.AWS_REGION!;
    const key = `profesores/${filename}`;

    // 👉 Hacemos que el objeto sea público al subirlo
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: type,
      ACL: 'public-read', // 🔥 CLAVE: hace que cualquier usuario pueda ver la imagen
    });

    // URL de subida (PUT)
    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60, // 1 minuto
    });

    // URL pública final (GET)
    const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return { uploadUrl, key, publicUrl };
  }
}
