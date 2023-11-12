import jwt from 'jsonwebtoken';
import config from '../../../common/config/config';
import { NextFunction, Request, Response } from 'express';

class AuthChecker {
  // common auth check
  public commonAuthCheck = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        jwt.verify(token, config.JWT_SECRET);
        next();
      } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid Token' });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Authentication error!' });
    }
  };

  // queen auth check
  public queenAuthCheck = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const check = jwt.verify(token, config.JWT_SECRET);
        req.user = check;
        // if(check.role)
        next();
      } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid Token' });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Authentication error!' });
    }
  };

  // auth checker for social media
  public socialAuthCheck = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const check = jwt.verify(token, config.JWT_SECRET);
        req.user = check;
        next();
      } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid Token' });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Authentication error!' });
    }
  };

  // auth checker for training
  public trainingAuthCheck = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const check = jwt.verify(token, config.JWT_SECRET);
        req.user = check;
        next();
      } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid Token' });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Authentication error!' });
    }
  };
}

export default AuthChecker;
