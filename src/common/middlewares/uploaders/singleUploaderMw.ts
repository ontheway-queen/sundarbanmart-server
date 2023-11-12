import CustomError from '../../utils/errors/customError';
import Uploader from '../../utils/uploaders/uploader';
import { Request, Response, NextFunction } from 'express';
import AbstractUploader from './abstractUploader';

class SingleFileUploader extends AbstractUploader {
  private uploader: Uploader;
  constructor() {
    super();
    this.uploader = new Uploader(this.allowed_file_types, this.error_message);
  }

  /**
   * upload
   */
  public upload(folder: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const upload = this.uploader.conpressedUpload();

      // call the middleware function
      upload.single('photo')(req, res, (err) => {
        if (err) {
          next(new CustomError(err.message, 500, 'Upload failed'));
        } else {
          req.upFolder = folder;
          this.compresser.compresse(folder)(req, res, next);
        }
      });
    };
  }

  /**
   * rawUpload
   */
  public rawUpload(folder: string, field?: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const allowed_file_types = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'video/mp4',
        'image/webp',
      ];

      const error_message =
        'Only .pdf, .doc, .docx, .jpg,.mp4, .gif, .jpeg or .png format allowed!';

      const upload = new Uploader(allowed_file_types, error_message).rawUpload(
        folder
      );

      // call the middleware function
      upload.single(field || 'cv')(req, res, (err) => {
        if (err) {
          next(new CustomError(err.message, 500, 'Upload failed'));
        } else {
          req.upFolder = folder;
          next();
        }
      });
    };
  }
}

export default SingleFileUploader;
