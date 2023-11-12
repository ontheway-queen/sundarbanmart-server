import { NextFunction, Request, Response } from 'express';
import { io } from '../../../common/socket/socket';
import Lib from '../../../common/utils/libraries/lib';
import AbstractController from '../../../abstracts/abstractController';
import notificationServices from '../../services/adminPanelServices/notificationServices';
import OrderServices from '../../services/orderServices/orderServices';

class OrderControllers extends AbstractController {
  private orderServices = new OrderServices();

  private notificationServices = new notificationServices();

  constructor() {
    super();
  }

  /**
   * createOrder
   */
  public createOrder = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.createOrder(req);
      const customerNumber: number = req.body?.guest_info?.phone;
      if (data.success) {
        res.status(200).json({
          success: true,
          message: data.message,
          order_id: data.data.id,
        });
        const notification = await this.notificationServices.postNotification(
          'new-order',
          { msg: 'New Order Placed' }
        );
        const orderComplete: string = `Your order has been placed.\nYour order id is OTW-O${data.data.id}.\nWe will call you as soon as possible for order confirmation! Thank you.\nonthe-way.com`;
        if (customerNumber) {
          Lib.sendSms(customerNumber, orderComplete);
        }
        io.emit('new_notification', notification);
        io.emit('new_order', data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getAQueensAllOrder
   */
  public getAQueensAllOrders = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getAQueensAllOrders(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getAQueensAllOrder by status
   */
  public getAQueensAllOrderByStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getAQueensAllOrderByStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getACustomersAllOrders
   */
  public getACustomersAllOrders = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getACustomersAllOrders(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getAllOrders
   */
  public getAllOrders = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getAllOrders(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getAllOrders by status
   */
  public getAllOrdersByStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getAllOrdersByStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getAllOrders by status or date range
   */
  public getAllOrdersByStatusOrDateRange = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getAllOrdersByStatusOrDate(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getAOrder
   */
  public getAOrder = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getAOrder(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * get an products all products
   */
  public getAnOrdersAllProducts = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getAnOrdersAllProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(404).json(data);
      }
    }
  );

  // get an order status for track
  public getOrderStatusTrack = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.getOrderStatusTrack(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Invalid order id or phone');
      }
    }
  );

  /**
   * updateOrderStatus
   */
  public updateOrderStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.orderServices.updateOrderStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default OrderControllers;
