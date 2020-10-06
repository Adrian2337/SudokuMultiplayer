const socket = io(window.location.origin)
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const minutes = document.getElementById('parameters');
const minutesInput = document.getElementById('minutes-input');
const timeLeft = document.getElementById('seconds');
const sudoku_board = document.getElementById('sudoku');
const button_sudoku = document.getElementById('submit-sudoku');
const selector = document.getElementById('level');
const gamemode = document.getElementById('gamemode');


if (button_sudoku != null) {
    button_sudoku.addEventListener("click", function() {
        socket.emit('submit-sudoku', roomName, get_sudoku_board_from_client(), socket.id);
    })
}
if (minutes != null) {
    minutes.addEventListener('submit', e => {
        e.preventDefault();
        const minutes = minutesInput.value;
        const value = selector[selector.selectedIndex].value;
        const value_2 = gamemode[gamemode.selectedIndex].value;
        socket.emit('start-game', roomName, minutes, socket.id, value, value_2)
        minutesInput.value = ''
    })
}

if (messageForm == null) {
    var name = document.getElementById('login').innerHTML;
} else {
    var has_submitted = false;
    socket.emit('new-user', roomName, name, 0, false, false)
    appendMessage(`You joined with name: ${bold_name(name)}`, "HTML")
    //this listener causes sending message and emitting to others
    messageForm.addEventListener('submit', e => {
        e.preventDefault(); //no refresh when sending sth
        const message = messageInput.value
        appendMessage(`${bold_name("You")}: ${message}`, "HTML")
        socket.emit('send-chat-message', roomName, message)
        messageInput.value = ''
    })
}

socket.on('room-created', room => {
    const roomElement = document.createElement('div')
    roomElement.setAttribute('class', 'room');
    roomElement.innerText = room;
    const roomLink = document.createElement('a')
    roomLink.setAttribute('class', 'link');
    roomLink.href = `/${room}`
    roomLink.innerText = 'Join'
    roomContainer.append(roomElement)
    roomContainer.append(roomLink)
})

socket.on('update-rooms', rooms => {
    if (roomContainer != null) {
        roomContainer.innerHTML = "";
    }
    var list = Object.keys(rooms);
    for (var room in list) {
        var roomElement = document.createElement('div')
        roomElement.setAttribute('class', 'room');
        roomElement.innerText = list[room];
        var roomLink = document.createElement('a')
        if (roomLink != null) {
            roomLink.setAttribute('class', 'link');
            roomLink.href = `/${list[room]}`
            roomLink.innerText = 'Join'
        }
        if (roomContainer != null) {
            roomContainer.append(roomElement)
            roomContainer.append(roomLink)
        }
    }
})

socket.on('chat-message', data => {
    appendMessage(`${bold_name(data.name)}: ${data.message}`, "HTML")
})

socket.on('send-minutes-message', data => {
    appendMessage(`Someone set ${data.minutes} minutes to play. Game starts`, "HTML")
    for (var a = 0; a < data.sudoku.length; a++) {
        for (var b = 0; b < data.sudoku[a].length; b++) {
            const x = sudoku_board.children.namedItem(`${a}`).children.namedItem(`${b}`).firstElementChild;
            x.value = "";
            if (x.hasAttribute("onkeydown")) {
                x.removeAttribute("onkeydown");
            }
            if (data.sudoku[a][b] > 0) {
                x.value = data.sudoku[a][b];
                x.style = "background-color: #808080; color: #ffffff";
                x.setAttribute("onkeydown", "return false");
            } else {
                x.style = "background-color: #ffffff";
            }
        }
    }
})

socket.on('game-has-ended', check => {
    var string = "Results: \n";
    for (var a = 0; a < check.length; a++) {
        string += check[a][0];
        string += ", ";
        string += check[a][1];
        string += "\n";
    }
    appendMessage(string, "TEXT");
});

socket.on('user-connected', name => {
    appendMessage(`${bold_name(name)} connected`, "HTML")
})

socket.on('user-disconnected', name => {
    appendMessage(`${bold_name(name)} disconnected`, "HTML")
})

socket.on('timer', function(data) {
    timeLeft.value = data.countdown;
    if (timeLeft.value < 1) {
        appendMessage(`Time's up!`, "HTML") //sending checking and so on 
        socket.emit('submit-sudoku', roomName, get_sudoku_board_from_client(), socket.id)
    }
});

socket.on('first-message', (name) => {
    appendMessage(`${name} has submitted sudoku.`, "HTML")
})

function appendMessage(message, string) {
    const messageElement = document.createElement('div')
    if (string == "HTML") messageElement.innerHTML = message
    else if (string == "TEXT") messageElement.innerText = message
    messageContainer.append(messageElement)
}

function bold_name(name) {
    var bold_name = name
    var result = bold_name.bold(name)
    return result;
}

function get_sudoku_board_from_client() {
    var array = new Array(9);

    for (var i = 0; i < array.length; i++) {
        array[i] = new Array(9);
    }

    for (var a = 0; a < 9; a++) {
        for (var b = 0; b < 9; b++) {
            const x = sudoku_board.children.namedItem(`${a}`).children.namedItem(`${b}`).firstChild;
            array[a][b] = x.value;
        }
    }
    return array;
}