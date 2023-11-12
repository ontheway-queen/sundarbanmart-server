import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import productRatingServices from '../../services/productServices/productRatingServices';

class ratingController extends AbstractController {
  private ratingServices = new productRatingServices();
  constructor() {
    super();
  }

  /**
   * add product rating controller
   */
  public addProductRating = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.ratingServices.addProductRating(req);
      if (data.success) {
        res
          .status(200)
          .json({ success: true, msg: 'Rating added successfully!' });
      } else {
        this.error(data.msg);
      }
    }
  );

  // get a product all ratings/reviews
  public getProductRatings = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.ratingServices.getProductRatings(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('rating not found', 404, 'Not found');
      }
    }
  );

  // get a customer all ratings/reviews
  public getCustomerRatings = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.ratingServices.getCustomerRatings(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('rating not found', 404, 'Not found');
      }
    }
  );

  // delete a rating/review
  public deleteRating = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.ratingServices.deleteRating(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.msg, 404, 'Not found');
      }
    }
  );

  // check rating of a customer and product
  public checkRating = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.ratingServices.checkRatingOfCustomer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Something is wrong', 404, 'Not found');
      }
    }
  );
}

export default ratingController;
