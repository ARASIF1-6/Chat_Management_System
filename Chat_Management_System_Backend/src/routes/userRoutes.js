import express from 'express';
import AuthController from '../controllers/authController.js';
import AuthService from '../services/authService.js';
import UserRepository from '../repositories/userRepository.js';
import { Sequelize } from 'sequelize';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize dependencies
const sequelize = new Sequelize(process.env.DATABASE_URL);
const userModel = User(sequelize);
const userRepository = new UserRepository(userModel);
const userService = new AuthService(userRepository);
const userController = new AuthController(userService);

// Routes
router.post('/register', (req, res) => userController.signup(req, res));
router.post('/login', (req, res) => userController.login(req, res));
// Sync Sequelize model with database
await sequelize.sync();

export default router;