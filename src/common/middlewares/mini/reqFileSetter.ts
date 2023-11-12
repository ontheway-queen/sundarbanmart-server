import { NextFunction, Request, Response } from 'express';

class ReqFileSetter {
  /**
   * setRequest
   */
  public setRequest(req: Request, _res: Response, next: NextFunction) {
    const { filename } = (req.file as Express.Multer.File) || {};
    const files = req.files as Express.Multer.File[];

    if (filename) {
      req.upFiles = filename;
    } else if (req.files) {
      let filesToSet: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const filename = files[i].filename;
        if (filename) {
          filesToSet.push(filename);
        }
      }

      req.upFiles = filesToSet;
    }

    next();
  }
}

export default ReqFileSetter;
