"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("./common/middlewares/errorHandlers/errorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const socket_1 = require("./common/socket/socket");
const config_1 = __importDefault(require("./common/config/config"));
const notFoundRoute_1 = __importDefault(require("./common/middlewares/mini/notFoundRoute"));
const otwApp_1 = __importDefault(require("./appOntheway/otwApp"));
const path_1 = __importDefault(require("path"));
const compress_1 = __importDefault(require("./common/middlewares/compresser/compress"));
const origin = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://server.sunderbanmart.com',
    'https://www.server.sunderbanmart.com',
    'https://sunderbanmart.com',
    'https://www.sunderbanmart.com',
    'https://admin.sunderbanmart.com',
    'https://www.admin.sunderbanmart.com',
];
class App {
    constructor(port, otwRouters) {
        this.origin = origin;
        this.compressor = new compress_1.default();
        this.app = (0, express_1.default)();
        this.port = port;
        this.server = (0, socket_1.socketServer)(this.app);
        this.initMiddlewares();
        this.fileSender();
        this.initRouters(otwRouters);
        this.socket();
        this.errorHandler();
    }
    initMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, morgan_1.default)('tiny'));
        this.app.use((0, cookie_parser_1.default)(config_1.default.COOKIE_SECRET));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)({ origin: this.origin, credentials: true }));
    }
    fileSender() {
        /**
         *
         * GET IMAGE
         */
        this.app.get('/api/get/image/:folder/:filename', (req, res) => {
            const { folder, filename } = req.params;
            res.sendFile(path_1.default.resolve(`${__dirname}/uploads/${folder}/${filename}`));
        });
        // send a video file
        this.app.get('/api/get/video/:folder/:filename', (req, res) => {
            const { folder, filename } = req.params;
            res.sendFile(path_1.default.resolve(`${__dirname}/uploads/${folder}/${filename}`));
        });
        // send video file as stream
        this.app.get('/api/get/video/stream/:folder/:filename', (req, res) => {
            const { folder, filename } = req.params;
            // Ensure there is a range given for the video
            const range = req.headers.range;
            if (!range) {
                res.status(400).send('Requires Range header');
            }
            else {
                const videoPath = `${__dirname}/uploads/${folder}/${filename}`;
                const videoSize = fs_1.default.statSync(`${__dirname}/uploads/${folder}/${filename}`).size;
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
                const videoStream = fs_1.default.createReadStream(videoPath, { start, end });
                // Stream the video chunk to the client
                videoStream.pipe(res);
            }
        });
        /**
         * DOWNLOAD FILE
         */
        this.app.get('/api/download/files/:folder/:filename', (req, res) => {
            const { folder, filename } = req.params;
            res.download(path_1.default.resolve(`${__dirname}/uploads/${folder}/${filename}`));
        });
    }
    initRouters(otwRouters) {
        this.app.get('/', (_req, res) => {
            res.send('server is running...');
        });
        // ontheway application
        this.app.use('/', new otwApp_1.default(otwRouters).app);
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
        this.app.use(new notFoundRoute_1.default()[404]);
    }
    errorHandler() {
        const errorHandler = new errorHandler_1.default();
        this.app.use(errorHandler.handleErrors);
    }
    socket() {
        socket_1.io.on('connection', (socket) => {
            console.log('connected: ' + socket.id);
        });
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log(`server is listening at ${this.port}....`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map