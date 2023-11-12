import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import commonServices from '../../../common/services/commonServices';

class ExternalController extends AbstractController {
  private commonService = new commonServices();
  constructor() {
    super();
  }

  // atab payment success
  public atabPaymentSuccess = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonService.atabPaymentSuccess(req);
      if (data.success) {
        res.redirect(`${data.data}/payment-success`);
      } else {
        res.redirect(`${data}/payment-failed`);
      }
    }
  );

  // atab payment failed
  public atabPaymentFailed = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonService.atabPaymentFailed(req);
      res.redirect(`${data.data}/payment-failed`);
    }
  );

  // atab payment cancelled
  public atabPaymentCancelled = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonService.atabPaymentCancelled(req);
      res.redirect(`${data.data}/payment-failed`);
    }
  );

  // create video app test
  public createVideoAppTest = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonService.createVideoAppTest(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(400).json(data);
      }
    }
  );

  // get all video app test
  public getVideoAppTest = this.assyncWrapper.wrap(
    async (_req: Request, res: Response) => {
      const data = await this.commonService.getAllAppVideos();
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(400).json(data);
      }
    }
  );
}
export default ExternalController;
