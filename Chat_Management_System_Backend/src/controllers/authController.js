export default class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async signup(req, res) {
    try {
      const user = await this.authService.signup(req.body);
      res.status(201).json({
        success: true,
        data: { id: user.id, username: user.username }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { user, token } = await this.authService.login(req.body);
      res.status(201).json({
        success: true,
        user, token
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}