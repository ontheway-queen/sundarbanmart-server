import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstractController';
import queenOffersServices from '../../services/queenOffersServices/queenOffersServices';

class queenOffersController extends AbstractController {
  private queenOffersServices = new queenOffersServices();
  constructor() {
    super();
  }

  // cteate an offer
  public createQueenOffer = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.createQueensOffer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message);
      }
    }
  );

  // update a queens offer
  public updateQueensOffer = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.updateQueensOffer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message);
      }
    }
  );

  // get all queens offer
  public getAllQueensOffer = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.getAllQueensOffer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get all queens offer by status
  public getAllQueensOfferByStatus = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.getAllQueensOfferByStatus(
        req
      );
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get a single queens offer
  public getASingleQueensOffer = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.getASingleQueensOffer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(500).json(data);
      }
    }
  );

  // queen get an queens offer
  public queenGetAnOffer = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.queenGetAnOffer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(500).json(data);
      }
    }
  );

  // update a get offer by queen
  public updateQueensGettingOffer = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.updateQueensGettingOffer(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(500).json(data);
      }
    }
  );

  // get an offers getting all queens
  public offersAllGettingQueen = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.offersAllGettingQueen(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(500).json(data);
      }
    }
  );

  // get a queens getting all offer
  public queensGettingAllOffers = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const data = await this.queenOffersServices.queensGettingAllOffers(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(500).json(data);
      }
    }
  );
}

export default queenOffersController;
