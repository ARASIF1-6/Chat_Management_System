export default class ChatController {
  constructor(chatService) {
    this.chatService = chatService;
  }

  async createChat(req, res) {
    try {
      const { userIds, name, isGroup } = req.body;
      const chat = await this.chatService.createChat(userIds, name, isGroup);
      res.status(201).json({
        success: true,
        chat
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async sendMessage(req, res) {
    try {
      const { chatId, senderId, content } = req.body;
      const message = await this.chatService.sendMessage(chatId, senderId, content);
      res.status(201).json({
        success: true,
        message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getChats(req, res) {
    try {
      const { userId } = req.params;
      const chats = await this.chatService.getChats(userId);
      res.status(201).json({
        success: true,
        chats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getMessages(req, res) {
    try {
      const { chatId } = req.params;
      const messages = await this.chatService.getMessages(chatId);
      res.status(201).json({
        success: true,
        messages
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}