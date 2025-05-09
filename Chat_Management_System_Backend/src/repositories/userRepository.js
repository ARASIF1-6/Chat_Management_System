export default class UserRepository {
    constructor(model) {
      this.model = model;
    }
  
    async create(userData) {
      return await this.model.create(userData);
    }

    async findOne(username) {
      return await this.model.findOne(username);
    }

    async findByPk(id) {
     return await this.model.findByPk(id);
    }
}