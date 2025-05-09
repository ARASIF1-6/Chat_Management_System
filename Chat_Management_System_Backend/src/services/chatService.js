export default class ChatService {
  constructor(chatRepository, userRepository, messageRepository, userModel, chatModel) {
    this.chatRepository = chatRepository;
    this.userRepository = userRepository;
    this.messageRepository = messageRepository;
    this.userModel = userModel;
    this.chatModel = chatModel;
  }

  async createChat(userIds, name, isGroup) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new Error('userIds is required and must be a non-empty array.');
    }

    const chat = await this.chatRepository.create({ name, isGroup });

    const users = await this.userRepository.model.findAll({
      where: { id: userIds }
    });

    if (users.length !== userIds.length) {
      throw new Error('One or more userIds are invalid.');
    }

    await chat.addUsers(users);

    return chat;
  }

  async sendMessage(chatId, senderId, content) {
    const message = await this.messageRepository.create({ chatId, senderId, content });
    return message;
  }

  async getChats(userId) {
    const user = await this.userModel.findByPk(userId, {
      include: [{ model: this.chatModel }],
    });
    return user?.Chats || [];
  }

  async getMessages(chatId) {
    const messages = await this.messageRepository.model.findAll({
      where: { chatId },
      include: [{ model: this.userModel, attributes: ['username'] }],
    });
    return messages;
  }
}