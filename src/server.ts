import App from './app';
import config from './common/config/config';
import OtwRouters from './appOntheway/routers/otwRouters';

const otwRouters = new OtwRouters();

const app = new App(config.PORT, otwRouters);

app.listen();
