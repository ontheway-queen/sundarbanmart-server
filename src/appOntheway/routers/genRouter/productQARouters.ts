import AbstractRouter from '../../../abstracts/abstractRouter';
import productQAController from '../../controllers/genController/productQAController';

class productQARouters extends AbstractRouter {
  productQAController = new productQAController();
  constructor() {
    super();

    this.callRouters();
  }

  private callRouters() {
    // ask a question post router
    this.routers.post(
      '/ask/question',
      this.productQAController.askQuestionControlle
    );

    // get all question answer of a product
    this.routers.get(
      '/get/all/product/:id',
      this.productQAController.getAllQuestionsByProduct
    );

    // get all questions of a customer
    this.routers.get(
      '/get/all/customer/:id',
      this.productQAController.getAllQuestionsByCustomer
    );

    // get all questions for admin by type
    this.routers.get(
      '/get/all/:type',
      this.productQAController.getAllNotQuestionsForAdmin
    );

    // get all question by product for admin
    this.routers.get(
      '/get/all/by-product/:id',
      this.productQAController.getAllQuestionsByProductForAdmin
    );

    // answer a question
    this.routers.put(
      '/answer/question/:id',
      this.productQAController.answerQuestion
    );

    // delete a question
    this.routers.delete(
      '/delete/question/:id/:by',
      this.productQAController.deleteQuestion
    );
  }
}
export default productQARouters;
