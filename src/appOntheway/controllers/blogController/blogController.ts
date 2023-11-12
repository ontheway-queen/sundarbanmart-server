import AbstractController from '../../../abstracts/abstractController';
import BlogServices from '../../services/blogServices/blogServices';
import { io } from '../../../common/socket/socket';
import { Request, Response } from 'express';

class BlogController extends AbstractController {
  private blogService = new BlogServices();
  constructor() {
    super();
  }

  // post a blog for admin
  public postBlogAdmin = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      req.body.author_name = 'Ontheway';
      const data = await this.blogService.postBlog(req, 'Admin');

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message);
      }
    }
  );

  // post a blog for queen
  public postBlogQueen = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      if (req.body.author_name && req.body.author_id) {
        const data = await this.blogService.postBlog(req, 'Queen');
        if (data.success) {
          res.status(200).json(data);
        } else {
          this.error(data.message);
        }
      } else {
        this.error('Author name and id is required');
      }
    }
  );

  // get all blog by type and status and all
  public getAllBlogByTypeStatusAll = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const { type, status } = req.params;
      const { skip, limit } = req.query;
      const data = await this.blogService.getAllBlogsByTypeStatusAll(
        type,
        status,
        skip as string,
        limit as string
      );

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // get a single blog for admin or queen
  public getASingelBlogForAdminQueen = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = await this.blogService.getASingleBlog(Number(id), 'all');

      if (data.success) {
        io.emit('for-andorid', `Shamol bro your socket is connected`);
        res.status(200).json(data);
      } else {
        res.status(404).json(data);
      }
    }
  );

  // get a single blog for public
  public getASingleBlogForPublic = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = await this.blogService.getASingleBlog(
        Number(id),
        'Approved'
      );

      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(404).json(data);
      }
    }
  );

  // update a blog for admin panel
  public updateABlogForAdmin = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      console.log(req.body);
      const data = await this.blogService.updateABlog(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message);
      }
    }
  );

  // post a blog for queen
  public updateABlogForQueen = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      if (req.body.author_id) {
        const data = await this.blogService.updateABlog(
          req,
          req.body.author_id
        );
        if (data.success) {
          res.status(200).json(data);
        } else {
          this.error(data.message);
        }
      } else {
        this.error('You cant update blog without author id');
      }
    }
  );

  // delete a Blog for admin
  public deleteABlogForAdmin = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const data = await this.blogService.deleteABlog(parseInt(id));
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(500).json(data);
      }
    }
  );

  // delete a Blog for queen
  public deleteABlogForQueen = this.assyncWrapper.wrap(
    async (req: Request, res: Response) => {}
  );
}

export default BlogController;
