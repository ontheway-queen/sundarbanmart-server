import { NextFunction, Request, Response } from 'express';
import CustomError from '../../../common/utils/errors/customError';

type func = (req: Request, res: Response, next: NextFunction) => Promise<void>;

class AssyncWrapper {
  // CONTROLLER ASYNCWRAPPER
  public wrap(cb: func) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await cb(req, res, next);
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          return next(
            new CustomError(
              'The token you provided has been expired',
              400,
              'Token expired'
            )
          );
        }
        console.log({ sad: err.sql });
        next(new CustomError(err.message, err.status, err.type));
      }
    };
  }
}

export default AssyncWrapper;
