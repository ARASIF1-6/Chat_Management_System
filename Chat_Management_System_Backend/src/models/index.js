import User from './user.js';
import Chat from './chat.js';
import Message from './message.js';

export const initModels = (sequelize) => {
  const UserModel = User(sequelize);
  const ChatModel = Chat(sequelize);
  const MessageModel = Message(sequelize);

  // Associations
  UserModel.belongsToMany(ChatModel, { through: 'UserChats' });
  ChatModel.belongsToMany(UserModel, { through: 'UserChats' });
  MessageModel.belongsTo(UserModel, { foreignKey: 'senderId' });
  MessageModel.belongsTo(ChatModel, { foreignKey: 'chatId' });

  return { User: UserModel, Chat: ChatModel, Message: MessageModel };
};