// DOM elements
const joinContainer = document.getElementById('joinContainer');
const chatContainer = document.getElementById('chatContainer');
const usernameInput = document.getElementById('username');
const roomIdInput = document.getElementById('roomId');
const joinBtn = document.getElementById('joinBtn');
const roomDisplay = document.getElementById('roomDisplay');
const userCountDisplay = document.getElementById('userCount');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Socket.io connection
const socket = io();

// Current room and user info
let currentRoom = '';
let username = '';

// Join room function
function joinRoom() {
  username = usernameInput.value.trim() || `User-${generateRandomId(4)}`;
  currentRoom = roomIdInput.value.trim();
  
  if (!currentRoom) {
    alert('Please enter a room ID');
    return;
  }
  
  // Join the room via socket
  socket.emit('joinRoom', currentRoom);
  
  // Update UI
  roomDisplay.textContent = currentRoom;
  joinContainer.style.display = 'none';
  chatContainer.style.display = 'flex';
  
  // Add system message
  addMessage({
    userId: 'system',
    message: `Welcome to room ${currentRoom}!`,
    timestamp: new Date().toISOString()
  });
}

// Send message function
function sendMessage() {
  const message = messageInput.value.trim();
  
  if (!message) return;
  
  socket.emit('sendMessage', {
    roomId: currentRoom,
    message: message
  });
  
  // Clear input
  messageInput.value = '';
}

// Add message to chat
function addMessage(data) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  // Determine message type
  if (data.userId === 'system') {
    messageElement.style.backgroundColor = '#f8f9fa';
    messageElement.style.color = '#6c757d';
    messageElement.style.textAlign = 'center';
    messageElement.style.margin = '10px auto';
    messageElement.style.fontStyle = 'italic';
    messageElement.style.width = '100%';
    messageElement.textContent = data.message;
  } else {
    const isOwnMessage = data.userId === socket.id;
    messageElement.classList.add(isOwnMessage ? 'outgoing' : 'incoming');
    
    const infoElement = document.createElement('div');
    infoElement.classList.add('message-info');
    
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    infoElement.textContent = isOwnMessage 
      ? `You • ${formatTime(data.timestamp)}`
      : `${username} • ${formatTime(data.timestamp)}`;
    
    const textElement = document.createElement('div');
    textElement.textContent = data.message;
    
    messageElement.appendChild(infoElement);
    messageElement.appendChild(textElement);
  }
  
  chatMessages.appendChild(messageElement);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate a random ID (for anonymous usernames)
function generateRandomId(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

// Event listeners
joinBtn.addEventListener('click', joinRoom);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

// Socket event listeners
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('message', (data) => {
  addMessage(data);
});

socket.on('userJoined', (data) => {
  userCountDisplay.textContent = data.userCount;
  
  // Add system message about user joining
  if (data.userId !== socket.id) {
    addMessage({
      userId: 'system',
      message: 'A new user has joined the room',
      timestamp: new Date().toISOString()
    });
  }
});

socket.on('userLeft', (data) => {
  userCountDisplay.textContent = data.userCount;
  
  addMessage({
    userId: 'system',
    message: 'A user has left the room',
    timestamp: new Date().toISOString()
  });
}); 