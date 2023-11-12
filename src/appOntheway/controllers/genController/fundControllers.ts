import { Request, Response } from 'express';
import { io } from '../../../common/socket/socket';
import AbstractController from '../../../abstracts/abstractController';
import FundServices from '../../services/fundServices/fundServices';

class FundControllers extends AbstractController {
  private fundServices = new FundServices();

  constructor() {
    super();
  }

  /**
   * queenApplyForFund
   */
  public queenApplyForFund = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.fundServices.queenApplyForFund(req);

      if (data.success) {
        res.status(200).json(data);
        io.emit('new_fund_application', data);
      } else {
        this.error();
      }
    }
  );

  /**
   * queenUpdateGuaranter
   */
  public queenUpdateGuaranter = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.fundServices.queenUpdateGuaranter(req);

      if (data.success) {
        res.status(200).json({
          success: true,
          message: data.message,
          g_photo: data.data,
          g_id: data.id,
        });
      } else {
        this.error();
      }
    }
  );

  /**
   * queenUpdateGuaranerNids
   */
  public queenUpdateGuaranerNids = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonServices.updateNids('fund_guaranter', req);

      if (data.success) {
        res
          .status(200)
          .json({ success: true, message: data.message, data: data.data });
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  /**
   * getAQueensAllApplications
   */
  public getAQueensAllApplications = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.fundServices.getAQueensAllApplications(req);

      if (data.success) {
        res.status(200).json({ success: true, data: data.data });
      } else {
        this.error();
      }
    }
  );
}

export default FundControllers;
