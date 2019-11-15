const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const exec = require('child_process').exec

var visibleFields, jsonBoard

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
  socket.on('submit-sudoku', (room, submited_sudoku, id) => 
  {
     console.log("id:", id);
     console.log("socket.id: ", socket.id)
     if(rooms[room].users[id].has_submitted === false)
     {
        rooms[room].users[id].has_submitted = true;
        io.in(room).to(id).emit('first-message');
        console.log("submited_sudoku: ", submited_sudoku);
        console.log("sudoku_answer: ", rooms[room].sudoku_answer);
        rooms[room].users[socket.id].points = calculate_points(1, 0, -1, preprocess_sudoku(submited_sudoku, rooms[room].sudoku_answer));
        io.in(room).to(id).emit('second-message', rooms[room].users[id].points);
        var check = sort_results(rooms[room].users);
        if(check !== null)
        {
           io.in(room).emit('game-has-ended', check);
           rooms[room].is_game_played = false;
        }
     }
     else
     {
        io.in(room).to(id).emit('third-message');
     }
  })
  socket.on('end-game', (room) =>
  {
    io.in(room)
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
            console.log("jsonBoard", jsonBoard);
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
                console.log(rooms[room]);
            }
            var countdown = 30;
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
        });

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
    console.log(d[0],d[1],d[2]);
    return a*d[0]+b*d[1]+c*d[2]
}

function sort_results(associative_array)
{
  var array = [];
  console.log("array as:", associative_array);
  for(var user in associative_array)
  {
    if(associative_array[user].has_submitted == false)
    {
        return null;
    }
    array.push([associative_array[user].name, associative_array[user].points]);
  }
  array.sort(function(a,b) 
  {
    return b[1]-a[1];
  });
  return array;
}

function createBoard (callback) 
{
  const cmdstring=' java -cp .\\src generator.BoardCreatorMain '+ visibleFields.toString()
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

