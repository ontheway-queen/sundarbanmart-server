import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import notificationServices from '../../services/adminPanelServices/notificationServices';

class notificationController extends AbstractController {
  private notificationServices = new notificationServices();
  constructor() {
    super();
  }

  //get all notification
  public getAllNotification = this.assyncWrapper.wrap(
    async (_req: Request, res: Response) => {
      const data = await this.notificationServices.getAllNotification();

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  //update notification
  public updateNotification = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.notificationServices.readNotification(req);
      res.status(200).json(data);
    }
  );

  //clear all notification
  public clearNotifications = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.notificationServices.clearNotifications();

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}
export default notificationController;
