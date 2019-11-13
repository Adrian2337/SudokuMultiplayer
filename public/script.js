const socket = io('http://localhost:3000')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const minutes = document.getElementById('start-game')
const minutesInput= document.getElementById('minutes-input');

if (messageForm != null) 
{
  const name = prompt('What is your name?')
  appendMessage(`You joined with name: ${bold_name(name)}`)
  socket.emit('new-user', roomName, name)

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

if (minutes != null)
{
  minutes.addEventListener('submit', e => 
  {
    console.log("I got to minutes")
    e.preventDefault();
    const message = minutesInput.value;
    appendMessage(`You chose ${message} minutes!`)
    socket.emit('send-minutes', roomName, message)
    minutesInput.value = ''
  })
}


socket.on('room-created', room => 
{
  const roomElement = document.createElement('div') //tworzymy diva
  roomElement.innerText = room;
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => 
{
  appendMessage(`${bold_name(data.name)}: ${data.message}`)
})

socket.on('send-minutes-message', data => 
{
  appendMessage(`Someone set ${data.message} minutes to play`)
})

socket.on('user-connected', name => 
{
  appendMessage(`${bold_name(name)} connected`)
})

socket.on('user-disconnected', name => 
{
  appendMessage(`${bold_name(name)} disconnected`)
})

/* socket.on('test-event', name => {
  appendMessage(`Hello, ${name}!`);
}) */

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
  return result
}

