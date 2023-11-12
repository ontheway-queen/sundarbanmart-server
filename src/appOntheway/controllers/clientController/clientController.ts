import { Request, Response } from 'express';
import { io } from '../../../common/socket/socket';
import AbstractController from '../../../abstracts/abstractController';
import clientSideServices from '../../services/clientSideServices/clientSideServices';

class clientController extends AbstractController {
  private clientSideServices = new clientSideServices();
  constructor() {
    super();
  }

  //Contact msg post controller
  public sendContactMsg = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.clientSideServices.sendContactMsg(req);
      if (data.success) {
        res.status(200).json(data);
        io.emit('new_contact_msg', {
          ...req.body,
          id: data.id,
          msg_date: data.msg_date,
          status: data.status,
        });
      } else {
        this.error(data.message);
      }
    }
  );

  // get all contact msgs controller
  public getAllContactMsg = this.assyncWrapper.wrap(
    async (_req: Request, res: Response) => {
      const data = await this.clientSideServices.getAllContactMsg();
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get a single contact msg controller

  public getSingleContactMsg = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.clientSideServices.getSingleContactMsg(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // update singel contact msg controller
  public updateSingleContactMsg = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.clientSideServices.updateSingleContactMsg(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default clientController;
