import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import AdminFundServices from '../../services/fundServices/adminFundServices';

class AdminFundControllers extends AbstractController {
  private adminFundServices = new AdminFundServices();

  constructor() {
    super();
  }

  /**
   * getAllFunds
   */
  public getAllFunds = this.assyncWrapper.wrap(
    async (_req: Request, res: Response): Promise<void> => {
      const data = await this.adminFundServices.getAllFunds();

      if (data.success) {
        res.status(200).json({ success: true, data: data.data });
      } else {
        this.error();
      }
    }
  );

  /**
   * getAFund
   */
  public getAFund = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.adminFundServices.getAFund(req);

      if (data.success) {
        res.status(200).json({ success: true, data: data.data });
      } else {
        this.error();
      }
    }
  );

  /**
   * updateQueenFundStatus
   */
  public updateQueenFundInfo = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.adminFundServices.updateQueenFundInfo(req);

      if (data.success) {
        res.status(200).json({ success: true, message: data.message });
      } else {
        this.error();
      }
    }
  );
}

export default AdminFundControllers;
