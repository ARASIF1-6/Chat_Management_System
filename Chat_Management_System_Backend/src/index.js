import express from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { initModels } from './models/index.js';
import { setupWebSocket } from './ws/chatSocket.js';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env file');
}

const app = express();
const server = http.createServer(app);
// const io = new Server(server);

app.use(cors({
  origin: 'http://localhost:3000', // allow frontend
  methods: ['GET', 'POST'],
  credentials: true // if use cookies or authorization headers
}));

// Setup Socket.IO server with CORS config
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');
  // your socket logic here
});

app.use(express.json());

// Database setup
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

initModels(sequelize);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

// WebSocket setup
setupWebSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});