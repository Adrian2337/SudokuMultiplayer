const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)


const exec = require('child_process').exec


let visibleFields=40, jsonBoard


function createBoard (callback) {

const cmdstring=' java -cp .\\out\\production\\SudokuMultiplayer generator.BoardCreatorMain '+ visibleFields.toString()
exec(cmdstring,
    function (error, stdout, stderr) {
        if (error !== null)
            callback(err);
        callback(null, stdout);
    })}

    createBoard(function (err, out) {
    jsonBoard=out


    console.log(jsonBoard)
        /**
         * exec jest asynchroniczny
         * wszystko co potrzebuje planszy musi wystartować stąd
         */

    });


app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

app.get('/', (req, res) => 
{
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => 
{
  if (rooms[req.body.room] != null) 
  {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {}, is_game_played: false }
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => 
{
  if (rooms[req.params.room] == null) 
  {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(3000)

io.on('connection', socket => 
{
  socket.on('new-user', (room, name, points) => 
  {
    socket.join(room)
    rooms[room].users[socket.id] = {name, points}
    socket.to(room).broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', (room, message) => 
  {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id].name })
  })
  socket.on('start-game', (room, minutes, id) =>
  {
    console.log("socket.id:", id);
    if(rooms[room].is_game_played == false)
    {
      io.in(room).emit('send-minutes-message', { minutes: minutes, name: rooms[room].users[socket.id].name, boolean: rooms[room].is_game_played });
      rooms[room].is_game_played = true;
      for(user in rooms[room].users)
      {
          user.points = 0;
          //console.log(rooms[room].users);
      }
      //console.log(rooms[room].users);
      var countdown = 15;
      const time = setInterval( function() 
      {
        countdown--;
        io.in(room).emit('timer', { countdown: countdown});
        if (countdown < 1) 
        {
          clearInterval(time);
        }
      }, 1000);

    }
    else
    {
      //console.log("I got there, so what?", id);
      io.in(room).to(id).emit('cannot-start-game');
    }
  })
  socket.on('disconnect', () => 
  {
    getUserRooms(socket).forEach(room => 
      {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id].name)
      delete rooms[room].users[socket.id]
      if (Object.keys(rooms[room].users).length == 0) 
      {
        delete rooms[room];
      }
    })
  })
})

function getUserRooms(socket) 
{
  return Object.entries(rooms).reduce((names, [name, room]) => 
  {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}