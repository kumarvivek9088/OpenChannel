# OpenChannel - Real-time Chat Application

A simple real-time chat application built with Node.js, Express, and Socket.IO where users can join rooms and share messages in real-time.

## Features

- Create or join chat rooms with a custom room ID
- Real-time messaging within rooms
- Displays user count in each room
- System messages for user join/leave events
- Simple and responsive UI

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) installed (v14+ recommended)

2. Clone this repository or download the files

3. Install dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. Enter an optional username (a random one will be generated if left blank)
2. Enter a room ID to create a new room or join an existing one
3. Share the room ID with others so they can join the same room
4. Start chatting!

## How It Works

- The application uses Socket.IO to establish WebSocket connections
- Users are organized into rooms based on the room ID they provide
- Messages are only broadcast to users in the same room
- The server keeps track of active rooms and users

## License

MIT 