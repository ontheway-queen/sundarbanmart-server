import ErrorHandler from './common/middlewares/errorHandlers/errorHandler';
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'http';
import fs from 'fs';
import { io, socketServer } from './common/socket/socket';
import OtwRouters from './appOntheway/routers/otwRouters';
import config from './common/config/config';
import Notfound from './common/middlewares/mini/notFoundRoute';
import OtwApp from './appOntheway/otwApp';
import path from 'path';
import Compresser from './common/middlewares/compresser/compress';

const origin = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://server.sunderbanmart.com',
  'https://www.server.sunderbanmart.com',
  'https://sunderbanmart.com',
  'https://www.sunderbanmart.com',
];

class App {
  private app: Application;
  private port: number;
  private origin = origin;
  private server: Server;
  compressor = new Compresser();

  constructor(port: number, otwRouters: OtwRouters) {
    this.app = express();
    this.port = port;
    this.server = socketServer(this.app);
    this.initMiddlewares();
    this.fileSender();
    this.initRouters(otwRouters);
    this.socket();
    this.errorHandler();
  }

  private initMiddlewares() {
    this.app.use(express.json());
    this.app.use(morgan('tiny'));
    this.app.use(cookieParser(config.COOKIE_SECRET));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({ origin: this.origin, credentials: true }));
  }

  private fileSender() {
    /**
     *
     * GET IMAGE
     */
    this.app.get('/get/image/:folder/:filename', (req, res) => {
      const { folder, filename } = req.params;
      res.sendFile(path.resolve(`${__dirname}/uploads/${folder}/${filename}`));
    });

    // send a video file
    this.app.get('/get/video/:folder/:filename', (req, res) => {
      const { folder, filename } = req.params;
      res.sendFile(path.resolve(`${__dirname}/uploads/${folder}/${filename}`));
    });

    // send video file as stream
    this.app.get('/get/video/stream/:folder/:filename', (req, res) => {
      const { folder, filename } = req.params;
      // Ensure there is a range given for the video

      const range = req.headers.range;

      if (!range) {
        res.status(400).send('Requires Range header');
      } else {
        const videoPath = `${__dirname}/uploads/${folder}/${filename}`;
        const videoSize = fs.statSync(
          `${__dirname}/uploads/${folder}/${filename}`
        ).size;

        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // Create headers
        const contentLength = end - start + 1;

        const headers = {
          'Content-Range': `bytes ${start}-${end}/${videoSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': contentLength,
          'Content-Type': 'video/mp4',
        };
        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, { start, end });
        // Stream the video chunk to the client
        videoStream.pipe(res);
      }
    });

    /**
     * DOWNLOAD FILE
     */
    this.app.get('/download/files/:folder/:filename', (req, res) => {
      const { folder, filename } = req.params;
      res.download(path.resolve(`${__dirname}/uploads/${folder}/${filename}`));
    });
  }

  private initRouters(otwRouters: OtwRouters) {
    this.app.get('/', (_req, res) => {
      res.send('server is running...');
    });

    // ontheway application
    this.app.use('/', new OtwApp(otwRouters).app);

    // freelancing application
    // this.app.use('/out', new OutApp(outRouters).app);

    // social media application
    // this.app.use('/otw-social', new QsocialApp(qSocialRouters).app);

    // training application
    // this.app.use('/otw-training', new TrainingApp(otwTrainingRouter).app);

    // this.app.post('/success', (req: Request, res: Response) => {
    //   console.log(req.body);
    //   res.status(200).json(req.body);
    // });

    /**
     * not found router
     */
    this.app.use(new Notfound()[404]);
  }

  private errorHandler() {
    const errorHandler = new ErrorHandler();
    this.app.use(errorHandler.handleErrors);
  }

  private socket() {
    io.on('connection', (socket) => {
      console.log('connected: ' + socket.id);
    });
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`server is listening at ${this.port}....`);
    });
  }
}

export default App;
