const path = require('path');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const store = {
  test: 1,
};

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./build/index.html'));
});

app.get('/client.js', (req, res) => {
  res.sendFile(path.resolve('./build/client.js'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('status', store);
  socket.on('setStore', (data) => {
    store.test = data;
    console.log(store);
  });
});

http.listen(8000, () => {
  console.log('listening on *:8000');
});
