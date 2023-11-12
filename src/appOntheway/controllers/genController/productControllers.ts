import { NextFunction, Request, Response } from 'express';
import { io } from '../../../common/socket/socket';
import AbstractController from '../../../abstracts/abstractController';
import notificationServices from '../../services/adminPanelServices/notificationServices';
import CommonProductServices from '../../services/productServices/commonProductServices';
import ProductServices from '../../services/productServices/productServices';

class ProductControllers extends AbstractController {
  private productServices = new ProductServices();
  private commonProductServices = new CommonProductServices();
  private notificationServices = new notificationServices();
  constructor() {
    super();
  }

  /**
   * queenUploadProduct
   */
  public queenUploadProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response, _next: NextFunction) => {
      const data = await this.productServices.queenUploadProduct(req);
      if (data.success) {
        res.status(200).json({ success: true, data: data.data });

        const notification = await this.notificationServices.postNotification(
          'new-product',
          { msg: 'New Product Added' }
        );
        io.emit('new_notification', notification);
        io.emit('new_product', data.data);
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  /**
   * getAQueensAllProducts
   */
  public getAQueensAllProducts = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const products = await this.commonProductServices.getAQueensAllProducts(
        'products',
        req
      );

      if (products.success) {
        res.status(200).json({ success: true, data: products.data });
      } else {
        this.error();
      }
    }
  );

  /**
   * getAllProductsByCategory
   */
  public getAllProductsByCategory = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonProductServices.getAllProductsByCategory(
        'products',
        req
      );

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getAProduct
   */
  public getAProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonProductServices.getAProduct(
        'products',
        req
      );

      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(404).json(data);
      }
    }
  );

  /**
   * queenUpdateProduct
   */
  public queenUpdateProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = await this.productServices.queenRequestUpdateProduct(req);

      if (data.success) {
        res.status(200).json({ success: true, message: data.message });

        const notification = await this.notificationServices.postNotification(
          'product-updated',
          { msg: 'Product Updated', update_id: Number(id) }
        );
        io.emit('new_notification', notification);
        io.emit('new_update_product_request', data);
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  /**
   * deleteProduct
   */
  public deleteProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonProductServices.deleteProduct(req);

      if (data.success) {
        res.status(200).json({ success: true, message: data.message });
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  /**
   * getAllApprovedProducts
   */
  public getAllApprovedProducts = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productServices.getAllApprovedProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * searchProducts
   */
  public searchProducts = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productServices.searchProducts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default ProductControllers;
