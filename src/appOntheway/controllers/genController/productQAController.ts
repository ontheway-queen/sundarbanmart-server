import { NextFunction, Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import productQAService from '../../services/productServices/productQAServices';

class productQAController extends AbstractController {
  productQAService = new productQAService();
  constructor() {
    super();
  }

  // post a question controller
  public askQuestionControlle = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productQAService.askQuestionService(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Cannot ask question now!');
      }
    }
  );

  // get all questions of a product
  public getAllQuestionsByProduct = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productQAService.getAllQuestionServiceClient(
        req,
        'product'
      );
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Cannot get all questions now!');
      }
    }
  );

  // get all questions of a customer
  public getAllQuestionsByCustomer = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productQAService.getAllQuestionServiceClient(
        req,
        'customer'
      );
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Cannot get all questions now!');
      }
    }
  );

  // get all not answered questions for admin
  public getAllNotQuestionsForAdmin = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productQAService.getAllQuestionServiceAdmin(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Cannot get all questions now!');
      }
    }
  );

  // get all not answered questions for admin
  public getAllQuestionsByProductForAdmin = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productQAService.getAllQuestionOfProductForAdmin(
        req
      );
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Cannot get all questions now!');
      }
    }
  );

  // answer a question by admin
  public answerQuestion = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productQAService.updateQuestion(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Something is wrong, Try again!');
      }
    }
  );

  // delete a question
  public deleteQuestion = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.productQAService.updateQuestion(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Question cannot delete now!');
      }
    }
  );
}

export default productQAController;
