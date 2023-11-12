import AbstractRouter from '../../../abstracts/abstractRouter';
import ratingController from '../../controllers/genController/ratingController';

class ratingRouter extends AbstractRouter {
  private ratingController = new ratingController();
  constructor() {
    super();
    this.callRouters();
  }

  private callRouters() {
    // add product rating
    this.routers.post(
      '/add/rating',
      this.multipleUploader.upload('rating'),
      this.reqSetter.setRequest,
      this.ratingController.addProductRating
    );

    // get a product all ratings/reviews
    this.routers.get(
      '/get/ratings/:product',
      this.ratingController.getProductRatings
    );

    // get a product all ratings/reviews
    this.routers.get(
      '/get/ratings/customer/:rater',
      this.ratingController.getCustomerRatings
    );

    // delete a rating/review
    this.routers.delete(
      '/delete/rating/:rating',
      this.ratingController.deleteRating
    );

    // check rating of a product and customer
    this.routers.get(
      '/check/rating/:product/:customer',
      this.ratingController.checkRating
    );
  }
}

export default ratingRouter;
