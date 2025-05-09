import express from 'express';
import ChatController from '../controllers/chatController.js';
import ChatService from '../services/chatService.js';
import UserRepository from '../repositories/userRepository.js';
import ChatRepository from '../repositories/chatRepository.js';
import MessageRepository from '../repositories/messageRepository.js';
import { Sequelize } from 'sequelize';
import { initModels } from '../models/index.js'; // ✅ Import initModels
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Sequelize and models
const sequelize = new Sequelize(process.env.DATABASE_URL);
const { User: userModel, Chat: chatModel, Message: messageModel } = initModels(sequelize); // ✅ Use initModels

// Repositories
const userRepository = new UserRepository(userModel);
const chatRepository = new ChatRepository(chatModel);
const messageRepository = new MessageRepository(messageModel);

// Services
const chatService = new ChatService(userRepository, chatRepository, messageRepository, userModel, chatModel);

// Controller
const chatController = new ChatController(chatService);

// Routes
router.post('/', (req, res) => chatController.createChat(req, res));
router.post('/message', (req, res) => chatController.sendMessage(req, res));
router.get('/user/:userId', (req, res) => chatController.getChats(req, res));

await sequelize.sync();

export default router;
