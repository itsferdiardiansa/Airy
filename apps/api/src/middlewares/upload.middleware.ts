import multer, { StorageEngine } from 'multer';
import createHttpError from 'http-errors';

interface UploadConfig {
  fileSize?: number;
  allowedTypes?: string[];
  fieldName?: string;
}

export class UploadMiddleware {
  private static readonly DEFAULT_LIMIT = 2 * 1024 * 1024; // 2MB
  private static readonly DEFAULT_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  static memory(config: UploadConfig = {}) {
    const storage: StorageEngine = multer.memoryStorage();

    const limits = {
      fileSize: config.fileSize ?? this.DEFAULT_LIMIT,
    };

    const fileFilter = (
      _req: any,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      const allowed = config.allowedTypes ?? this.DEFAULT_TYPES;

      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          createHttpError(
            400,
            `Invalid file type. Allowed: ${allowed
              .map((t) => t.split('/')[1])
              .join(', ')}`
          )
        );
      }
    };

    return multer({ storage, fileFilter, limits });
  }
}
