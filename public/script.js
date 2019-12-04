const socket = io(window.location.origin)
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const minutes = document.getElementById('parameters');
const minutesInput= document.getElementById('minutes-input');
const timeLeft = document.getElementById('seconds');
const sudoku_board = document.getElementById('sudoku');
const button_sudoku = document.getElementById('submit-sudoku');
const selector = document.getElementById('level');

if(button_sudoku != null)
{
  button_sudoku.addEventListener("click", function()
  {
    socket.emit('submit-sudoku', roomName, get_sudoku_board_from_client(), socket.id);
  })
}

if(minutes != null)
{
  minutes.addEventListener('submit', e => 
  {
      e.preventDefault();
      const minutes = minutesInput.value;
      const value = selector[selector.selectedIndex].value;
      socket.emit('start-game', roomName, minutes, socket.id, value)
      minutesInput.value = ''
  })
}

if (messageForm == null)
{
  var name = document.getElementById('login').innerHTML;
}
else
{
  var has_submitted = false;
  socket.emit('new-user', roomName, name, 0, false)
  appendMessage(`You joined with name: ${bold_name(name)}`)
  //ten listener powoduje ze wysylamy wiadomosc i ja emitujemy do innych
  messageForm.addEventListener('submit', e => 
  {
    console.log("I got to messageForm as well")
    e.preventDefault(); //dzieki tej funkcji nie rozlaczamy sie i nie laczymy sie ponownie (nie ma odswiezania strony) gdy cos wysylamy!!!
    const message = messageInput.value
    appendMessage(`${bold_name("You")}: ${message}`)
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  }) 
}

socket.on('room-created', room => 
{
  const roomElement = document.createElement('div') //tworzymy diva
  roomElement.setAttribute('class', 'room');
  roomElement.innerText = room;
  const roomLink = document.createElement('a')
  roomLink.setAttribute('class', 'link');
  roomLink.href = `/${room}`
  roomLink.innerText = 'Join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('update-rooms', rooms =>
{
  console.log("ROOM DELETED I'M GETTING THERE")
  if(roomContainer != null)
  {
    roomContainer.innerHTML = "";
  }
  console.log("rooms: ", rooms);
  var list = Object.keys(rooms);
  console.log("list: ", list);
  for (var room in list)
  {
    var roomElement = document.createElement('div') //tworzymy diva
    roomElement.setAttribute('class', 'room');
    roomElement.setAttribute('id', 'center');
    roomElement.innerText = list[room];
    var roomLink = document.createElement('a')
    if(roomLink != null)
    {
      roomLink.setAttribute('class', 'link');
      roomLink.setAttribute('id', 'center');
      roomLink.href = `/${list[room]}`
      roomLink.innerText = 'Join'
    }
    if(roomContainer != null)
    {
      roomContainer.append(roomElement)
      roomContainer.append(roomLink)
    }
  }
  /* var list = document.getElementsByClassName('room')
  for (var i = 0; i < list.length; i++) 
  {
    console.log(list[i]);
    if (list[i].innerHTML === room)
    {
      roomContainer.remove(list[i]);
    }
  }
  var list_2 = document.getElementsByClassName('link')
  for (var i = 0; i < list_2.length; i++) 
  {
    if (list_2[i].href === `/${room}`)
    {
      roomContainer.remove(list_2[i]);
    }
  } */
})

socket.on('chat-message', data => 
{
  appendMessage(`${bold_name(data.name)}: ${data.message}`)
})

socket.on('send-minutes-message', data => 
{
  appendMessage(`Someone set ${data.minutes} minutes to play. Game starts`)
  for (var a = 0; a < data.sudoku.length; a++)
  {
    for (var b = 0; b < data.sudoku[a].length; b++)
    {
      const x = sudoku_board.children.namedItem(`${a}`).children.namedItem(`${b}`).firstElementChild;
      x.value = "";
      if(x.hasAttribute("onkeydown"))
      {
        x.removeAttribute("onkeydown");
      }
      if(data.sudoku[a][b] > 0)
      {
        x.value = data.sudoku[a][b];
        x.style = "background-color: #808080; color: #ffffff";
        x.setAttribute("onkeydown", "return false");
      }
      else
      {
         x.style = "background-color: #ffffff";
      }
    }
  }
})

socket.on('game-has-ended', check => {
  appendMessage(check);
});

socket.on('user-connected', name => 
{
  appendMessage(`${bold_name(name)} connected`)
})

socket.on('user-disconnected', name => 
{
  appendMessage(`${bold_name(name)} disconnected`)
})

socket.on('timer', function(data) 
{
  timeLeft.value = data.countdown;
  if(timeLeft.value < 1)
  {
    appendMessage(`Time's up!`) //sending checking and so on 
    socket.emit('submit-sudoku', roomName, get_sudoku_board_from_client(), socket.id)
  }
});

socket.on('first-message', (name) =>
{
  appendMessage(`${name} has submitted sudoku.`)
})

socket.on('second-message', points =>
{
  appendMessage(`You've scored ${points} points`);
});

socket.on('third-message', () =>
{
  appendMessage("You've already submitted your sudoku");
})

function appendMessage(message) 
{
  const messageElement = document.createElement('div')
  messageElement.innerHTML = message
  messageContainer.append(messageElement)
}

function bold_name(name) //podkreslenie imienia
{
  var bold_name = name
  var result = bold_name.bold(name)
  return result;
}

function get_sudoku_board_from_client()
{
   var array = new Array(9);

   for (var i = 0; i < array.length; i++) 
   { 
    array[i] = new Array(9); 
   }
  
   for (var a = 0; a < 9; a++)
   {
      for(var b = 0; b < 9; b++)
      {
        const x = sudoku_board.children.namedItem(`${a}`).children.namedItem(`${b}`).firstChild;
        array[a][b] = parseInt(x.value);
      }
   }
   return array;
}
