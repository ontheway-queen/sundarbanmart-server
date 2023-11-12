import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import ContentImageServices from '../../services/contentImageServices/contentImageServices';

class ContentImagesController extends AbstractController {
  private contentImageServices = new ContentImageServices();
  constructor() {
    super();
  }

  // add or update slider images controller
  public postOrUpdateSliderImages = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.contentImageServices.sliderimageUploadOrUpdate(
        req
      );

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  //  get content images controller
  public getContentImages = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.contentImageServices.getContentImgs(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message);
      }
    }
  );

  // Update daily deals img
  public updateDailyDealsImg = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.contentImageServices.updateDailyDealsImgs(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default ContentImagesController;
