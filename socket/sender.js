const io = require("socket.io")({
  cors: true,
  origins: ["*"]
});
const server = io.listen(3000);
const fs = require("fs");

let sequenceNumberByClient = new Map();

function write_data(data, file) {
  var stream = fs.createWriteStream(file);
  stream.once('open', function(fd) {
    stream.write(data);
    stream.end();
  });
}

// event fired every time a new client connects:
server.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);

  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });

  // Send text to clients.
  socket.emit('text', 'Hello World!');
});

// sends each client its current sequence number
setInterval(() => {
  for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
    client.emit("seq-num", sequenceNumber);
    sequenceNumberByClient.set(client, sequenceNumber + 1);
  }
}, 1000);