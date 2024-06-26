import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db.js';
import { createServer } from 'http';
import { initSocket } from './utils/initSocket.js'; 
import logger from './utils/consoleLogger.js';

dotenv.config();

const PORT = process.env.PORT || 8000;
const host = '0.0.0.0';


connectDB().then(() => {
    const server = createServer(app);
    initSocket(server);
    server.listen(PORT, host,  () => logger.info(`Server running on port = ${PORT}`));
});