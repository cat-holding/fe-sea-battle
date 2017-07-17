const storage = {
  // { id: socket.id, nickname: String }
  users: [],
  // { idGame: socket.id,
  //   currUser: 0,
  //   users: [socket.id, socket.id],
  //   settings: {
  //     gridSize: 10,
  //     ships: {
  //       4: 1,
  //       3: 2,
  //       2: 3,
  //       1: 4,
  //     }
  //   },
  //   maps: {
  //     user1: [[]],
  //     user2: [[]],
  //   },
  //   ships: {
  //     user1: [],
  //     user2: [],
  //   }
  // }
  games: [],
};

module.exports = storage;
