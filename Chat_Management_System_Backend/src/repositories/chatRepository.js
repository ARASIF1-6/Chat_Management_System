export default class ChatRepository {
    constructor(model) {
      this.model = model;
    }
  
    async create(chatData) {
      return await this.model.create(chatData);
    }

    async findOne(username) {
      return await this.model.findOne(username);
    }
}