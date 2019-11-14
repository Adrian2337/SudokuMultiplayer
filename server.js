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
  rooms[req.body.room] = { users: {}, is_game_played: false, sudoku_answer: [] }
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

server.listen(8080)

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
  socket.on('submit-sudoku', (room) => 
  {
    
  })
  socket.on('end-game', (room) =>
  {
    io.in(room)
  })
  socket.on('start-game', (room, minutes, id) =>
  {
    if(rooms[room].is_game_played == false)
    {
      const sudoku = generate_new_game(Math.floor(Math.random()*10));
      io.in(room).emit('send-minutes-message', { minutes: minutes, name: rooms[room].users[socket.id].name, boolean: rooms[room].is_game_played, sudoku: sudoku.start_sudoku});
      
      rooms[room].is_game_played = true;
      rooms[room].sudoku_answer = sudoku.solver;
      for(user in rooms[room].users)
      {
          user.points = 0;
          //console.log(rooms[room].users);
      }
      //console.log(rooms[room].users);
      var countdown = 60000;
      const time = setInterval( function() 
      {
        countdown--;
        io.in(room).emit('timer', { countdown: countdown});
        if (countdown < 1) 
        {
          clearInterval(time);
          if(rooms[room] != null)
          {
            rooms[room].is_game_played = false;
          }
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

function generate_new_game(n)
{
  const object_1 = JSON.parse('{"solver": [[5, 2, 7, 1, 8, 4, 6, 3, 9], [3, 8, 4, 5, 9, 6, 1, 2, 7], [1, 6, 9, 2, 3, 7, 5, 8, 4], [8, 7, 3, 4, 2, 1, 9, 6, 5], [4, 5, 6, 3, 7, 9, 8, 1, 2], [9, 1, 2, 8, 6, 5, 7, 4, 3], [6, 9, 1, 7, 4, 3, 2, 5, 8], [2, 4, 5, 9, 1, 8, 3, 7, 6], [7, 3, 8, 6, 5, 2, 4, 9, 1]], "start_sudoku": [[0, 0, 7, 1, 8, 4, 0, 0, 9], [3, 8, 4, 5, 0, 6, 1, 0, 7], [0, 0, 9, 0, 3, 7, 5, 8, 0], [0, 7, 0, 0, 0, 0, 0, 0, 0], [4, 5, 6, 0, 0, 0, 8, 1, 2], [9, 0, 2, 8, 0, 5, 0, 0, 3], [0, 0, 1, 7, 4, 3, 2, 5, 8], [0, 4, 0, 0, 1, 0, 3, 7, 6], [0, 0, 0, 0, 0, 0, 0, 0, 0]]}')
  const object_2 = JSON.parse('{"solver": [[1, 2, 6, 9, 3, 5, 4, 8, 7], [4, 3, 5, 8, 2, 7, 1, 6, 9], [9, 7, 8, 6, 1, 4, 3, 2, 5], [6, 8, 4, 1, 5, 9, 2, 7, 3], [5, 9, 3, 4, 7, 2, 8, 1, 6], [2, 1, 7, 3, 8, 6, 5, 9, 4], [7, 6, 1, 2, 4, 3, 9, 5, 8], [3, 5, 2, 7, 9, 8, 6, 4, 1], [8, 4, 9, 5, 6, 1, 7, 3, 2]], "start_sudoku": [[0, 2, 0, 9, 0, 0, 0, 0, 7], [4, 0, 0, 8, 0, 0, 1, 6, 0], [9, 0, 8, 6, 0, 0, 0, 2, 0], [6, 8, 0, 0, 5, 9, 2, 7, 0], [0, 0, 3, 4, 7, 2, 0, 1, 0], [2, 1, 7, 0, 8, 0, 5, 9, 4], [7, 0, 0, 0, 0, 3, 9, 0, 0], [0, 5, 0, 0, 9, 8, 0, 0, 1], [8, 4, 0, 0, 6, 0, 0, 3, 0]]}')
  const object_3 = JSON.parse('{"solver": [[9, 4, 3, 2, 6, 8, 5, 7, 1], [8, 5, 2, 9, 1, 7, 6, 3, 4], [7, 6, 1, 4, 5, 3, 2, 9, 8], [6, 3, 8, 1, 9, 5, 4, 2, 7], [2, 7, 5, 6, 3, 4, 8, 1, 9], [4, 1, 9, 8, 7, 2, 3, 6, 5], [5, 8, 6, 7, 2, 9, 1, 4, 3], [1, 9, 4, 3, 8, 6, 7, 5, 2], [3, 2, 7, 5, 4, 1, 9, 8, 6]], "start_sudoku": [[9, 4, 0, 2, 0, 0, 5, 0, 1], [8, 0, 0, 0, 0, 0, 6, 0, 0], [7, 6, 1, 0, 0, 0, 0, 9, 0], [6, 3, 0, 0, 9, 0, 4, 0, 0], [2, 7, 5, 0, 3, 0, 8, 0, 9], [0, 0, 9, 0, 0, 0, 3, 6, 0], [5, 0, 6, 7, 2, 9, 0, 0, 3], [1, 0, 4, 0, 0, 6, 0, 5, 0], [0, 0, 0, 5, 4, 1, 9, 0, 6]]}')
  const object_4 = JSON.parse('{"solver": [[9, 7, 3, 5, 1, 4, 8, 6, 2], [8, 6, 1, 7, 9, 2, 5, 3, 4], [5, 2, 4, 8, 6, 3, 9, 1, 7], [1, 9, 8, 2, 4, 6, 7, 5, 3], [3, 4, 6, 1, 5, 7, 2, 8, 9], [2, 5, 7, 9, 3, 8, 1, 4, 6], [6, 8, 2, 4, 7, 5, 3, 9, 1], [7, 3, 9, 6, 8, 1, 4, 2, 5], [4, 1, 5, 3, 2, 9, 6, 7, 8]], "start_sudoku": [[9, 0, 0, 0, 1, 0, 0, 6, 0], [0, 0, 0, 7, 9, 2, 0, 0, 0], [5, 2, 0, 0, 6, 3, 0, 0, 7], [1, 0, 8, 2, 0, 0, 0, 0, 3], [3, 4, 0, 1, 5, 0, 2, 0, 0], [2, 5, 0, 0, 3, 0, 1, 0, 6], [6, 8, 2, 4, 0, 5, 0, 0, 1], [0, 0, 0, 6, 8, 0, 4, 0, 0], [4, 0, 0, 0, 2, 0, 6, 7, 0]]}')
  const object_5 = JSON.parse('{"solver": [[5, 7, 8, 3, 4, 2, 9, 6, 1], [9, 3, 4, 8, 6, 1, 5, 7, 2], [1, 2, 6, 5, 9, 7, 3, 4, 8], [2, 8, 3, 6, 1, 4, 7, 5, 9], [4, 1, 5, 9, 7, 8, 2, 3, 6], [6, 9, 7, 2, 5, 3, 1, 8, 4], [7, 4, 2, 1, 8, 5, 6, 9, 3], [3, 5, 9, 4, 2, 6, 8, 1, 7], [8, 6, 1, 7, 3, 9, 4, 2, 5]], "start_sudoku": [[0, 0, 8, 0, 4, 0, 0, 6, 0], [0, 3, 0, 8, 6, 0, 5, 0, 2], [1, 2, 0, 5, 9, 0, 0, 0, 8], [2, 0, 3, 0, 0, 4, 0, 5, 9], [4, 1, 0, 0, 0, 0, 0, 0, 0], [6, 0, 0, 2, 5, 0, 0, 8, 4], [0, 0, 2, 0, 0, 5, 6, 0, 0], [3, 0, 0, 4, 2, 0, 0, 0, 7], [8, 6, 1, 7, 0, 0, 4, 0, 0]]}')
  const object_6 = JSON.parse('{"solver": [[7, 4, 9, 1, 2, 3, 8, 6, 5], [3, 1, 5, 7, 6, 8, 4, 2, 9], [2, 6, 8, 5, 9, 4, 7, 3, 1], [9, 7, 6, 2, 4, 5, 3, 1, 8], [4, 3, 1, 9, 8, 7, 6, 5, 2], [5, 8, 2, 3, 1, 6, 9, 4, 7], [1, 2, 3, 6, 7, 9, 5, 8, 4], [6, 9, 4, 8, 5, 1, 2, 7, 3], [8, 5, 7, 4, 3, 2, 1, 9, 6]], "start_sudoku": [[7, 0, 9, 0, 2, 0, 0, 0, 0], [3, 1, 5, 0, 0, 8, 4, 0, 0], [2, 0, 0, 5, 9, 4, 0, 0, 1], [0, 7, 6, 0, 4, 0, 0, 0, 8], [0, 0, 0, 9, 0, 7, 0, 5, 0], [5, 0, 2, 0, 0, 0, 9, 4, 0], [1, 0, 0, 6, 0, 0, 0, 8, 0], [0, 0, 0, 0, 0, 1, 0, 7, 3], [8, 5, 0, 4, 3, 2, 0, 9, 0]]}')
  const object_7 = JSON.parse('{"solver": [[6, 5, 7, 8, 4, 9, 3, 2, 1], [4, 8, 9, 2, 3, 1, 5, 6, 7], [1, 2, 3, 6, 7, 5, 8, 4, 9], [3, 4, 2, 7, 9, 6, 1, 8, 5], [9, 7, 8, 5, 1, 2, 6, 3, 4], [5, 1, 6, 3, 8, 4, 7, 9, 2], [8, 6, 4, 9, 5, 7, 2, 1, 3], [2, 9, 5, 1, 6, 3, 4, 7, 8], [7, 3, 1, 4, 2, 8, 9, 5, 6]], "start_sudoku": [[6, 5, 7, 8, 0, 0, 3, 0, 0], [0, 8, 0, 2, 3, 1, 0, 0, 0], [1, 0, 0, 6, 7, 5, 0, 0, 9], [0, 0, 0, 7, 0, 0, 1, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 6, 3, 0, 4, 0, 9, 0], [0, 0, 4, 9, 5, 7, 0, 0, 0], [0, 9, 5, 0, 6, 3, 4, 0, 0], [7, 0, 0, 4, 0, 0, 9, 5, 6]]}')
  const object_8 = JSON.parse('{"solver": [[2, 5, 9, 7, 1, 8, 3, 4, 6], [1, 7, 3, 5, 6, 4, 9, 2, 8], [8, 4, 6, 9, 3, 2, 7, 1, 5], [7, 2, 8, 1, 5, 6, 4, 9, 3], [3, 9, 1, 8, 4, 7, 6, 5, 2], [5, 6, 4, 2, 9, 3, 1, 8, 7], [6, 8, 5, 4, 7, 1, 2, 3, 9], [4, 3, 2, 6, 8, 9, 5, 7, 1], [9, 1, 7, 3, 2, 5, 8, 6, 4]], "start_sudoku": [[2, 0, 9, 0, 1, 0, 0, 0, 0], [1, 7, 0, 0, 6, 0, 0, 0, 8], [0, 4, 6, 9, 0, 2, 0, 1, 5], [0, 2, 8, 1, 5, 0, 0, 0, 0], [3, 0, 0, 0, 0, 7, 0, 0, 0], [0, 0, 0, 0, 9, 0, 0, 0, 7], [6, 0, 5, 0, 0, 1, 2, 3, 0], [0, 0, 0, 0, 0, 9, 0, 7, 0], [0, 1, 7, 3, 2, 0, 0, 6, 4]]}')
  const object_9 = JSON.parse('{"solver": [[1, 7, 5, 2, 8, 3, 9, 6, 4], [8, 9, 2, 7, 6, 4, 3, 1, 5], [3, 6, 4, 5, 1, 9, 7, 2, 8], [6, 4, 7, 9, 2, 1, 5, 8, 3], [9, 5, 8, 6, 3, 7, 1, 4, 2], [2, 1, 3, 4, 5, 8, 6, 7, 9], [5, 2, 9, 1, 4, 6, 8, 3, 7], [7, 8, 1, 3, 9, 2, 4, 5, 6], [4, 3, 6, 8, 7, 5, 2, 9, 1]], "start_sudoku": [[1, 0, 0, 2, 8, 3, 0, 6, 4], [0, 0, 0, 0, 6, 0, 3, 0, 5], [0, 6, 4, 0, 0, 9, 0, 2, 0], [6, 0, 0, 0, 0, 0, 0, 0, 3], [0, 5, 8, 6, 0, 7, 0, 0, 0], [2, 0, 0, 0, 0, 0, 6, 0, 9], [5, 2, 9, 0, 4, 0, 0, 0, 7], [0, 8, 0, 3, 9, 0, 4, 0, 6], [0, 0, 0, 0, 0, 0, 0, 0, 1]]}')
  const object_10 = JSON.parse('{"solver": [[7, 6, 3, 9, 8, 1, 4, 5, 2], [5, 1, 2, 7, 3, 4, 8, 6, 9], [9, 4, 8, 6, 2, 5, 7, 3, 1], [6, 9, 1, 3, 5, 8, 2, 4, 7], [4, 8, 5, 1, 7, 2, 3, 9, 6], [3, 2, 7, 4, 9, 6, 1, 8, 5], [1, 7, 6, 8, 4, 9, 5, 2, 3], [8, 5, 9, 2, 1, 3, 6, 7, 4], [2, 3, 4, 5, 6, 7, 9, 1, 8]], "start_sudoku": [[7, 0, 0, 0, 8, 1, 4, 0, 0], [0, 0, 2, 0, 3, 4, 0, 6, 9], [0, 4, 8, 0, 2, 0, 0, 0, 1], [6, 0, 1, 0, 0, 0, 0, 0, 7], [0, 8, 0, 1, 0, 0, 0, 0, 0], [3, 0, 7, 0, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 9, 0, 2, 3], [0, 0, 0, 2, 0, 3, 0, 0, 0], [2, 0, 4, 0, 6, 0, 9, 1, 0]]}') 
  const array = [object_1, object_2, object_3, object_4, object_5, object_6, object_7, object_8, object_9, object_10]
  return array[n];
}

function preprocess_sudoku(client_array, solver_array)
{
    var correct_fields = 0;
    var void_fields = 0;
    var incorrect_fields = 0;
    for (var a = 0; a < client_array.length; a++)
    {
        for(var b = 0; b < client_array.length; b++)
        {
            if(client_array[a][b] === solver_array[a][b])
            {
                correct_fields++;
            }
            else if(client_array[a][b] === "")
            {
                void_fields++;
            }
            else if(client_array[a][b] !== solver_array[a][b])
            {
                incorrect_fields++;
            }
        }
    }

    return [correct_fields, void_fields, incorrect_fields];
}

function calculate_points(a, b, c, d = [correct_f, void_f, incorrect_f])
{
    return a*d[0]+b*d[1]+c*d[2]
}