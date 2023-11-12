import { NextFunction, Request, Response } from 'express';
import AbstractUploader from './abstractUploader';
import CustomError from '../../utils/errors/customError';
import Uploader from '../../utils/uploaders/uploader';

class NidUploader extends AbstractUploader {
  private uploader: Uploader;

  constructor() {
    super();

    this.uploader = new Uploader(this.allowed_file_types, this.error_message);
  }

  /**
   * upload
   */

  public upload(folder: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const upload = this.uploader.conpressedUpload();

      upload.any()(req, res, (err) => {
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

  public rawUpload(folder: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const allowed_file_types = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/rtf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
        'application/vnd.ms-excel',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/octet-stream',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'video/mp4',
      ];

      const error_message =
        'Only .pdf, .JPG, .doc, .docx, , ppt, pptx, pptm, rtf, xlsx, xlsb, xls, xlsm, .jpg, jpeg or .png format allowed!';

      const upload = new Uploader(allowed_file_types, error_message).rawUpload(
        folder
      );

      // call the middleware function
      upload.any()(req, res, (err) => {
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

export default NidUploader;
