export default class MessageRepository {
    constructor(model) {
      this.model = model;
    }
  
    async create(messageData) {
      return await this.model.create(messageData);
    }

    async findOne(username) {
      return await this.model.findOne(username);
    }
}