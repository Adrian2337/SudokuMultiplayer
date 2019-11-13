const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const minutes = document.getElementById('parameters');
const minutesInput= document.getElementById('minutes-input');

if(minutes != null)
{
  minutes.addEventListener('submit', e => 
  {
      e.preventDefault();
      const minutes = minutesInput.value;
      socket.emit('send-minutes', roomName, minutes, socket.id)
      minutesInput.value = ''
  })
}

if(messageForm == null)
{
  var name = prompt('What is your name?')
}
else
{
  socket.emit('new-user', roomName, name)
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
  roomElement.innerText = room;
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'Join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => 
{
  appendMessage(`${bold_name(data.name)}: ${data.message}`)
})

socket.on('send-minutes-message', data => 
{
  appendMessage(`Someone set ${data.message} minutes to play. Game starts`)
})

socket.on('cannot-start-game', () =>
{
  appendMessage(`You cannot start game because it already started!`)
})

socket.on('user-connected', name => 
{
  appendMessage(`${bold_name(name)} connected`)
})

socket.on('user-disconnected', name => 
{
  appendMessage(`${bold_name(name)} disconnected`)
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