const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const exec = require('child_process').exec

var visibleFields, jsonBoard
var socket_id;

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

app.get('/sign.ejs', (req, res) => 
{
  res.render('sign');
})

app.get('/', (req, res) => 
{
  io.emit('update-rooms', rooms);
  res.render('index', { rooms: rooms, login: null })
})

app.post('/', (req, res) => 
{
  console.log("login: ", req.body.login)
  console.log("password: ", req.body.password)
  io.emit('update-rooms', rooms);
  res.render('index', { rooms: rooms, login: req.body.login})
})

app.post('/room', (req, res) => 
{
  if (rooms[req.body.room] != null && req.body.room != 'sign.ejs') 
  {
    console.log("req.params.room: ", req.body.room);
    return res.redirect('/')
  }
  else if(req.body.room === 'sign.ejs')
  {
    console.log("req.params.room: ", req.body.room);
    console.log("DID nothing there");
  }
  else
  {
    console.log("req.params.room: ", req.body.room);
    rooms[req.body.room] = { users: {}, is_game_played: false, sudoku_answer: [] }
    res.redirect(req.body.room)
    // Send message that new room was created
    io.emit('update-rooms', rooms)
  }
})

app.get('/:room', (req, res) =>
{
  if (rooms[req.params.room] == null && req.params.room !== 'sign.ejs')
  {
    return res.redirect('/')
  }
  else if (req.params.room == 'sign.ejs')
  {
    console.log("Got to sign.ejs");
    for (var a = 0; a < 1; a++)
    {
      return res.redirect('/sign.ejs');
    }
  }
  else
  {
    res.render('room', { roomName: req.params.room })
  }
})

server.listen(8080)

io.on('connection', socket =>
{
  socket_id = socket.id;
  console.log("Socket.id when doing nothing", socket.id);
  socket.on('new-user', (room, name, points, is_playing) =>
  {
    console.log("socket.id when new-user: ", socket.id);
    socket.join(room)
    rooms[room].users[socket.id] = {name, points, is_playing}
    socket.to(room).broadcast.emit('user-connected', name)
    console.log(`new user ${rooms[room].users[socket.id].name} with socket.id: `, socket.id);
  })
  socket.on('send-chat-message', (room, message) =>
  {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id].name })
  })
  socket.on('submit-sudoku', (room, submited_sudoku, id) => 
  {
     if(rooms[room].users[id].has_submitted === false && rooms[room].users[id].is_playing === true)
     {
        rooms[room].users[id].has_submitted = true;
        rooms[room].users[socket.id].points = calculate_points(1, 0, -1, preprocess_sudoku(submited_sudoku, rooms[room].sudoku_answer));
        io.in(room).emit('first-message', rooms[room].users[id].name);
        var check = sort_results(rooms[room].users);
        if(check !== null)
        {
           io.in(room).emit('game-has-ended', check);
           rooms[room].is_game_played = false;
        }
     }
  })
  socket.on('start-game', (room, minutes, id, difficulty) =>
  {
    if(difficulty == 4)
    {
      visibleFields = Math.floor((Math.random()*9) + 70) // 70 do 79
    }
    else
    {
      visibleFields = Math.floor((Math.random()*9) + 27+(difficulty-1)*9) //27,36 lub 36,45 lub 45,54
    }

    if(rooms[room].is_game_played == false)
    {
        createBoard(function (err, out) {
            jsonBoard=out
            /**
             * exec jest asynchroniczny
             * wszystko co potrzebuje planszy musi wystartować stąd
             */
            const sudoku=JSON.parse(jsonBoard)
            io.in(room).emit('send-minutes-message', { minutes: minutes, name: rooms[room].users[socket.id].name, boolean: rooms[room].is_game_played, sudoku: sudoku.start_sudoku});
      
            rooms[room].is_game_played = true;
            rooms[room].sudoku_answer = sudoku.solver;
            for(user in rooms[room].users)
            {
                rooms[room].users[user].points = 0;
                rooms[room].users[user].has_submitted = false;
                rooms[room].users[user].is_playing = true;
            }
            var countdown = 60*minutes;
            const time = setInterval( function() 
            {
                countdown--;
                io.in(room).emit('timer', { countdown: countdown});
                if(rooms[room] != null)
                {
                  if (countdown < 1 || rooms[room].is_game_played === false) 
                  {
                      clearInterval(time);
                      if(rooms[room] != null)
                      {
                      rooms[room].is_game_played = false;
                      }
                  }
                }
              }, 1000);
        });

    }
  })
  socket.on('disconnect', () =>
  {
    console.log("getUserRooms for socket: ", getUserRooms(socket));
    getUserRooms(socket).forEach(room =>
      {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id].name)
      console.log("DELETING SOCKET...", socket.id);
      delete rooms[room].users[socket.id]
      console.log("no of users: ", Object.keys(rooms[room].users).length);
      if (Object.keys(rooms[room].users).length == 0)
      {
        console.log("DELETING ROOM ", room);
        delete rooms[room];
        io.emit('update-rooms', rooms);
      }
      else
      {
        console.log("CANNOT DELETE ROOM ", room);
        console.log("users:", Object.keys(rooms[room].users));
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

function preprocess_sudoku(client_array, solver_array)
{
    console.log(client_array);
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
            else if(client_array[a][b] === null)
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

function sort_results(associative_array)
{
  var array = [];
  for(var user in associative_array)
  {
    if(associative_array[user].has_submitted === false && associative_array[user].is_playing === true)
    {
        return null;
    }
    if(associative_array[user].has_submitted === true)
    {
      array.push([associative_array[user].name, associative_array[user].points-visibleFields]);
      if(associative_array[user].is_playing === true)
      {
        associative_array[user].is_playing = false;
      }
    }
  }
  array.sort(function(a,b) 
  {
    return b[1]-a[1];
  });
  return array;
}

function createBoard (callback) 
{
  const cmdstring=' java -cp .\\java\\generator\\production\\java\\ generator.BoardCreatorMain '+ visibleFields.toString()
  exec(cmdstring,function (error, stdout, stderr) 
  {
    if (error !== null)
    {
      callback(stderr);
    }
    callback(null, stdout);
    return stdout;
  })
}
