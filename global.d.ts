declare namespace Express {
  interface Request {
    andro?: boolean;
    upFolder: string;
    user: jwt.JwtPayload;
    upFiles: string | string[];
  }
}
