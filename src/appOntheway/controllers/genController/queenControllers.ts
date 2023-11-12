import { NextFunction, Request, Response } from 'express';
import { io } from '../../../common/socket/socket';
import AbstractController from '../../../abstracts/abstractController';
import notificationServices from '../../services/adminPanelServices/notificationServices';
import CommonQueenServices from '../../services/queenServices/commonQueenServices';
import QueenServices from '../../services/queenServices/queenService';

class QueenControllers extends AbstractController {
  private queenServices = new QueenServices();
  private commonQueenServices = new CommonQueenServices();
  private notificationServices = new notificationServices();

  constructor() {
    super();
  }
  /**
   * getAQueen
   */
  public getAQueen = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonQueenServices.getAQueen('queens', req);

      if (data.success) {
        res.status(200).json({ success: true, data: data.data });
      } else {
        this.error();
      }
    }
  );

  // get a queens all ref queen
  public getAQueensAllRefQ = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonQueenServices.getAQueensAllRefQ(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // search queen by name
  public searchQueen = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenServices.searchQueen(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * queenUploadNids
   */
  public queenUploadNids = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonServices.updateNids('admin_queens', req);

      if (data.success) {
        res
          .status(200)
          .json({ success: true, message: data.message, data: data.data });
      } else {
        this.error(data.message, data.status, 'Something went Wrong');
      }
    }
  );

  /**
   * updateQueensInfo
   */
  public updateQueensInfo = this.assyncWrapper.wrap(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const data = await this.queenServices.updateQueensInfo(req);
      if (data.success) {
        res.status(200).json({ success: true, message: data.message });

        const notification = await this.notificationServices.postNotification(
          'queen-updated',
          { msg: 'Updated her information', update_id: Number(id) }
        );
        io.emit('new_notification', notification);
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  /**
   * updateQueenDp
   */

  public updateQueenDp = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = await this.commonServices.updateDp('admin_queens', req);

      if (data.success) {
        res.status(200).json({
          success: true,
          message: data.message,
          filename: data.data,
        });

        const notification = await this.notificationServices.postNotification(
          'queen-updated',
          { msg: 'Updated her photo', update_id: Number(id) }
        );
        io.emit('new_notification', notification);
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  /**
   * getAllApprovedQueens
   */
  public getAllApprovedQueens = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenServices.getAllApprovedQueens(req);

      if (data.success) {
        res.status(200).json({
          success: true,
          data: data.data,
          ...(data.total && { total: data.total }),
        });
      } else {
        this.error();
      }
    }
  );

  /**
   * queenUpdatePassword
   */
  public queenUpdatePassword = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenServices.queenUpdatePassword(req);

      if (data.success) {
        res.status(200).json({ success: true, message: data.message });
      } else {
        this.error();
      }
    }
  );
}

export default QueenControllers;
