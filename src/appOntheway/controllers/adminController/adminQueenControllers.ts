import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import AdminQueensServices from '../../services/queenServices/adminQueenServices';
import CommonQueenServices from '../../services/queenServices/commonQueenServices';

class AdminQueenControllers extends AbstractController {
  private adminQueenServices = new AdminQueensServices();
  private commonQueenServices = new CommonQueenServices();

  constructor() {
    super();
  }

  /**
   * getAQueenByPhone
   */

  public getAQueen = (table: string) =>
    this.assyncWrapper.wrap(
      async (req: Request, res: Response): Promise<void> => {
        const data = await this.commonQueenServices.getAQueen(table, req);

        if (data.success) {
          res.status(200).json(data);
        } else {
          res
            .status(400)
            .json({ success: false, message: 'Cannot get all queens' });
        }
      }
    );

  /**
   * getAllQueens
   */

  public getAllQueens = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.adminQueenServices.getAllQueens(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Cannot get all queens', 400, 'Bad Request');
      }
    }
  );

  // get all queen by status for admin

  public getAllQueensByStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.adminQueenServices.getAllQueensByStatus(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Cannot get all queens', 400, 'Bad Request');
      }
    }
  );

  /**
   * updateQueensInfo
   */
  public updateQueensInfo = this.assyncWrapper.wrap(
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.adminQueenServices.updateQueensInfo(req);

      if (data.success) {
        res
          .status(200)
          .json({ success: true, message: data.message, img: data.data });
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  // get queen by date range
  public getQueenBydateRange = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminQueenServices.getQueenByDateRange(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get queen by date range and status
  public getQueenBydateRangeAndStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminQueenServices.getQueenByDateRangeAndStatus(
        req
      );
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get queen by date
  public getQueenBydate = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminQueenServices.getQueenByDate(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get queen by date and status
  public getQueenBydateAndStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminQueenServices.getQueenByDateAndStatus(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get queen by category and status or all
  public getQueenByCategoryAndStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data =
        await this.adminQueenServices.getQueenByQueenCategoryStatusAll(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default AdminQueenControllers;
