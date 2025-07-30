import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Configuration
const s3Config = {
  region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
};

const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET_NAME || '';

class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client(s3Config);
  }

  // Convert File to ArrayBuffer for browser compatibility
  private async fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Upload image directly to S3
  async uploadImage(file: File, folder: string = 'packages'): Promise<string> {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
      const fileName = `${folder}/${timestamp}-${randomString}-${cleanFileName}`;

      // Convert file to ArrayBuffer for browser compatibility
      const fileBuffer = await this.fileToArrayBuffer(file);

      // Create upload command
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
        Metadata: {
          'original-name': file.name,
          'upload-timestamp': timestamp.toString(),
        },
      });

      // Upload to S3
      await this.s3Client.send(command);

      // Return the public URL
      const imageUrl = `https://${BUCKET_NAME}.s3.${s3Config.region}.amazonaws.com/${fileName}`;
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new Error(`Failed to upload image to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get presigned URL for secure uploads (alternative method)
  async getPresignedUrl(fileName: string, fileType: string, folder: string = 'packages'): Promise<{ signedUrl: string; publicUrl: string }> {
    try {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '');
      const key = `${folder}/${timestamp}-${randomString}-${cleanFileName}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType,
        ACL: 'public-read',
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour
      const publicUrl = `https://${BUCKET_NAME}.s3.${s3Config.region}.amazonaws.com/${key}`;
      
      return { signedUrl, publicUrl };
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Upload multiple images with better error handling
  async uploadMultipleImages(files: File[], folder: string = 'packages'): Promise<string[]> {
    try {
      if (!files || files.length === 0) {
        return [];
      }

      // Upload images sequentially to avoid overwhelming the browser/network
      const imageUrls: string[] = [];
      for (const file of files) {
        try {
          const url = await this.uploadImage(file, folder);
          imageUrls.push(url);
        } catch (error) {
          console.error(`Failed to upload file ${file.name}:`, error);
          throw new Error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return imageUrls;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error(`Failed to upload images to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Check if S3 is properly configured
  isConfigured(): boolean {
    return !!(
      import.meta.env.VITE_AWS_REGION &&
      import.meta.env.VITE_AWS_ACCESS_KEY_ID &&
      import.meta.env.VITE_AWS_SECRET_ACCESS_KEY &&
      import.meta.env.VITE_AWS_S3_BUCKET_NAME
    );
  }
}

// Export singleton instance
export const s3Service = new S3Service();
export default s3Service;