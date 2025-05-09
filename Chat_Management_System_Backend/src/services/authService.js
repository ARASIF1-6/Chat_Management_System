import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async signup(userData) {
    const { username, password } = userData;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    return await this.userRepository.create({
      username,
      password: hashedPassword
    });
  }

  async login(userData) {
    const { username, password } = userData;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new Error('User not found');
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
  
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  }
}