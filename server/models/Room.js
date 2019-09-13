class Room {
  constructor() {
    this.users = [];
  }

  createUser(user) { // user: id, name, room
    this.users.push(user)
  }

  findUserIndexById(id) {
    return this.users.findIndex(user => user.id === id);
  }

  findUserById(id) {
    const userIndex = this.findUserIndexById(id)
    return this.users[userIndex]
  }

  deleteUserById(id) {
    const userIndex = this.findUserIndexById(id)
    this.users.splice(userIndex, 1);
    return this.users[userIndex];
  }
}

module.exports = Room;