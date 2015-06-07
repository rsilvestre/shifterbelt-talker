import ShifterbeltClient from '../shiflterbelt-client.js'

let shifterbeltClient = new ShifterbeltClient({
  url: String(process.argv.slice(2,3)[0]),
  applicationId: Number(process.argv.slice(3, 4)[0]),
  key: process.argv.slice(4, 5)[0],
  password: process.argv.slice(5, 6)[0],
  macAddress: process.argv.slice(6).toString()
});

shifterbeltClient.on('connect', (socket) => {
  console.log("connected on port 3000");
  let count = 0;
  if (socket.role === "slave") {
    setInterval(()=> {
      socket.emit('test', `first device message, ${count++}`);
    }, 3000);
  }

  if (socket.role === "master") {
    setInterval(()=> {
      socket.emit('test', 'b8e8563aa597', `first device message, ${count++}`);
    }, 3000);
  }

  socket.on('event', (message) => {
    console.log(`message: ${message}`);
  });

  if (socket.role === "slave") {
    socket.on('test', (message) => {
      console.log(`message: ${message}`);
    });
  }

  if (socket.role === "master") {
      socket.on('test', (sender, message) => {
      console.log(`sender: ${sender}, message: ${message}`);
    });
  }

  socket.on('disconnect', () => {
    console.log("has been disconnected");
  });
});

shifterbeltClient.on('error_system', (message) => {
  console.log(`There is an error: ${message}`);
});
