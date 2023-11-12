import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import CustomerServices from '../../services/customerServices/customerServices';
import jwt from 'jsonwebtoken';
import config from '../../../common/config/config';
import { io } from '../../../common/socket/socket';

class CustomerControllers extends AbstractController {
  private customerServices = new CustomerServices();
  private maxAge = 1000 * 60 * 60 * 24 * 30;

  constructor() {
    super();
  }

  /**
   * registerCustomer
   */
  public register = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      // const verified = jwt.verify(req.body.token, config.JWT_SECRET);
      // console.log({ verified });
      // if (verified) {
      const { token, ...rest } = req.body;
      const data = await this.customerServices.register(rest);

      if (data.success) {
        req.andro
          ? res.set('qotw', data.token)
          : res.cookie('qotw', data.token, {
              httpOnly: true,
              signed: true,
              maxAge: this.maxAge,
            });

        res.status(200).json({ success: true, data: data.user });

        io.emit('new_customer', data.user);
      } else {
        res.status(400).json(data);
      }
      // }
    }
  );

  /**
   * getAllCustomers
   */
  public getAllCustomers = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.customerServices.getAllCustomers(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getACustomer
   */
  public getACustomer = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.customerServices.getACustomer(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message, 404);
      }
    }
  );

  /**
   * updateCustomerInfo
   */
  public updateCustomerInfo = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.customerServices.updateCustomerInfo(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );
}

export default CustomerControllers;
