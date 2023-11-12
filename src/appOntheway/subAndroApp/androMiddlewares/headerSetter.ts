import { NextFunction, Request, Response } from 'express';

class HeaderSetter {
  public setHeader(req: Request, _res: Response, next: NextFunction) {
    req.andro = true;
    next();
  }
}

export default HeaderSetter;
