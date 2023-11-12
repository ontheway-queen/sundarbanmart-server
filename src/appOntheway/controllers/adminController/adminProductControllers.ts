import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import AdminProductServices from '../../services/productServices/adminProductsServices';
import CommonProductServices from '../../services/productServices/commonProductServices';

class AdminProductControllers extends AbstractController {
  private adminProductServices = new AdminProductServices();
  private commonProductServices = new CommonProductServices();

  constructor() {
    super();
  }

  /**
   * getAQueensAllProducts
   */
  public getAQueensAllProducts = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const products = await this.commonProductServices.getAQueensAllProducts(
        'admin_products',
        req
      );

      if (products.success) {
        res.status(200).json(products);
      } else {
        this.error();
      }
    }
  );

  // get all product by date range and or status and or category
  public getAllProductByDateRangeStatusCategory = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const products =
        await this.adminProductServices.getAllProductByDateRangeStatusCategory(
          req
        );

      if (products.success) {
        res.status(200).json(products);
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
        'admin_products',
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
   * updateProduct
   */
  public updateProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminProductServices.updateProduct(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  //approve update product
  public approveUpdateProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminProductServices.approveUpdateProduct(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  //approve update product
  public rejectUpdateProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminProductServices.rejectUpdateProduct(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message, 400, 'Bad request');
      }
    }
  );

  // get single update product request
  public getSingleUpdateProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminProductServices.getASingleProductUpdate(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get a queens all update product request
  public getQueensUpdateProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data =
        await this.adminProductServices.getAllPendingUpdateProductOfQueen(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get all update pending products
  public getAllUpdatePendingProducts = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.adminProductServices.getAllPendingUpdateProduct(
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
   * getAllProducts
   */
  public getAllProducts = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonProductServices.getAllProducts(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * getAllProductsByStatus
   */

  public getAllProductsByStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.commonProductServices.getAllProductsByStatus(req);

      if (data.success) {
        res.status(200).json(data);
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
        'admin_products',
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
   * getAllProductsByCategory and status
   */
  public getAllProductsByCategoryAndStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data =
        await this.commonProductServices.getAllProductsByCategoryAndStatus(
          'admin_products',
          req
        );

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default AdminProductControllers;
