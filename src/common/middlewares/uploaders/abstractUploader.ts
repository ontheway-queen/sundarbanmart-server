import { NextFunction, Request, Response } from 'express';
import Compresser from '../compresser/compress';

const allowed_file_types = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

abstract class AbstractUploader {
  protected allowed_file_types: string[];
  protected error_message: string;
  protected compresser: Compresser;

  constructor() {
    this.allowed_file_types = allowed_file_types;
    this.error_message = 'Only .jpg, .jpeg, .webp or .png format allowed!';
    this.compresser = new Compresser();
  }

  abstract upload(
    folder: string
  ): (req: Request, res: Response, next: NextFunction) => void;

  abstract rawUpload(
    folder: string
  ): (req: Request, res: Response, next: NextFunction) => void;
}

export default AbstractUploader;
