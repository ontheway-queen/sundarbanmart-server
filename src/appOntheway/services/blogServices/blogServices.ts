import { Request } from 'express';
import { RowDataPacket } from 'mysql2';
import AbstractServices from '../../../abstracts/abstractServices';
import { TCompare, TWhere } from '../../../common/utils/commonTypes/types';

class BlogServices extends AbstractServices {
  constructor() {
    super();
  }

  // post blog
  public async postBlog(req: Request, type: string) {
    req.body.type = type;
    if (type === 'Admin') {
      req.body.status = 'Approved';
    }
    const { filename } = req.file as Express.Multer.File;
    if (filename) {
      req.body.thumbnail = filename;
    } else {
      return {
        success: false,
        message: 'Cannot post a blog without thumbnail photo',
      };
    }

    const result = await this.query.insert('ontheway_blogs', req.body);

    if (result.insertId) {
      return {
        success: true,
        data: { id: result.insertId, thumbnail: filename },
      };
    } else {
      return {
        success: false,
        message: 'Cannot post blog now try again',
      };
    }
  }

  // get all blogs by type and status and all
  public async getAllBlogsByTypeStatusAll(
    type: string,
    status: string,
    skip: string,
    limit: string
  ) {
    type = type.toLocaleLowerCase();
    status = status.toLocaleLowerCase();
    let totalSql = `SELECT count(id) as total FROM ngf_ecommerce.ontheway_blogs`;
    let totalDepArray: string[] = [];
    let where:
      | {
          table: string;
          field: string;
          value: string | number;
          compare?: TCompare;
          date?: true;
        }
      | TWhere
      | undefined = undefined;
    const table = 'ontheway_blogs';
    const columns = [
      'id',
      'title',
      'thumbnail',
      'author_name',
      'author_id',
      'post_date',
      'status',
    ];
    if (type !== 'all' && status !== 'all') {
      where = {
        and: [
          { table, field: 'type', value: `'${type}'` },
          { table, field: 'status', value: `'${status}'` },
        ],
      };
      totalSql = `SELECT count(id) as total FROM ngf_ecommerce.ontheway_blogs WHERE ontheway_blogs.type = ? and ontheway_blogs.status = ?`;
      totalDepArray.push(type);
      totalDepArray.push(status);
    } else if (status !== 'all') {
      where = { table, field: 'status', value: `'${status}'` };
      totalSql = `SELECT count(id) as total FROM ngf_ecommerce.ontheway_blogs WHERE ontheway_blogs.status = ?`;
      totalDepArray.push(status);
    } else if (type !== 'all') {
      where = { table, field: 'type', value: `'${type}'` };
      totalSql = `SELECT count(id) as total FROM ngf_ecommerce.ontheway_blogs WHERE ontheway_blogs.type = ?`;
      totalDepArray.push(type);
    } else {
      columns.push('type');
    }

    const data = await this.query.select({
      table,
      fields: {
        columns,
      },
      where: where,
      orderBy: { table, field: 'post_date' },
      desc: true,
      limit: { limit, skip },
    });

    const [total] = (await this.query.rawQuery(
      totalSql,
      totalDepArray
    )) as RowDataPacket[];

    return {
      success: true,
      total: total.total,
      data,
    };
  }

  // get a single blog
  public async getASingleBlog(id: number, status: string) {
    const table = 'ontheway_blogs';
    const columns = [
      'id',
      'title',
      'description',
      'thumbnail',
      'author_name',
      'author_id',
      'post_date',
      'status',
      'type',
    ];
    let where:
      | {
          table: string;
          field: string;
          value: string | number;
          compare?: TCompare;
          date?: true;
        }
      | TWhere = { table, field: 'id', value: id };

    if (status === 'Approved') {
      where = {
        and: [
          { table, field: 'id', value: id },
          { table, field: 'status', value: `'${status}'` },
        ],
      };
    }

    const data = await this.query.select({ table, fields: { columns }, where });
    if (data.length) {
      return {
        success: true,
        data: data[0],
      };
    } else {
      return {
        success: false,
        message: 'No blog found with this id',
      };
    }
  }

  //update a Blog
  public async updateABlog(req: Request, author?: number) {
    const table = 'ontheway_blogs';
    const { id } = req.params;
    let body = req.body;
    const { filename } = req.file as Express.Multer.File;

    const checkBlog = await this.query.select({
      table,
      fields: { columns: ['author_id', 'thumbnail'] },
      where: { table, field: 'id', value: id },
    });

    if (!checkBlog.length) {
      return {
        success: false,
        message: 'No blog found with this id',
      };
    }

    if (author) {
      if (checkBlog[0].author_id !== author) {
        return {
          success: false,
          message: 'You have not access to update this blog',
        };
      }
      const { author_id, status, ...rest } = req.body;
      body = rest;
    }

    if (filename) {
      body.thumbnail = filename;
      if (checkBlog[0].thumbnail) {
        this.deleteFile.delete('blog_thumbnails', checkBlog[0].thumbnail);
      }
    }

    const res = await this.query.update({ table, data: body, where: { id } });

    if (res.affectedRows) {
      return {
        success: true,
        data: { thumbnail: filename },
        message: 'Blog updated successfully',
      };
    } else {
      return {
        success: false,
        message: 'Cannot update blog now',
      };
    }
  }

  // delete a Blog
  public async deleteABlog(id: number, author?: number) {
    const table = 'ontheway_blogs';
    const checkBlog = await this.query.select({
      table,
      fields: { columns: ['author_id', 'thumbnail'] },
      where: { table, field: 'id', value: id },
    });

    if (!checkBlog.length) {
      return {
        success: false,
        message: 'No blog found with this id',
      };
    }

    if (author) {
      if (author !== checkBlog[0].author_id) {
        return {
          success: false,
          message: 'You dont have access to delete this blog',
        };
      }
    }

    const res = await this.query.delete({ table, where: { id } });

    if (res.affectedRows) {
      if (checkBlog[0].thumbnail) {
        await this.deleteFile.delete('blog_thumbnails', checkBlog[0].thumbnail);
      }

      return {
        success: true,
        message: 'Blog deleted successfully!',
      };
    } else {
      return {
        success: false,
        message: 'Cannot delete blog now',
      };
    }
  }
}

export default BlogServices;
