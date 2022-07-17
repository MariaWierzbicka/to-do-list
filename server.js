const express = require('express');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use(cors());
app.use(express.static(path.join(__dirname, '/client/src/index')));

const io = socket(server);

const tasks = [
  {id: 1, name: 'Shopping'},
  {id: 2, name: 'Laundry'}
];

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('remove', (id) => {
    const taskIndex = tasks.indexOf(tasks.find(task => task.id === id));
    tasks.splice(taskIndex, 1);
    socket.emit('updateData', tasks);
    socket.broadcast.emit('updateData', tasks);

  });

  socket.on('addTask', (taskName) => {
    tasks.push({id: uuidv4(), name: taskName});
    socket.emit('updateData', tasks);
    socket.broadcast.emit('updateData', tasks);
  })


});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
