import { Router } from 'express';
import ReqFileSetter from '../common/middlewares/mini/reqFileSetter';
import MultipleUploader from '../common/middlewares/uploaders/multipleUploader';
import FileUploader from '../common/middlewares/uploaders/singleUploaderMw';

abstract class AbstractRouter {
  readonly routers = Router();
  protected singleUploader = new FileUploader();
  protected multipleUploader = new MultipleUploader();
  protected reqSetter = new ReqFileSetter();
}

export default AbstractRouter;
