export const setupWebSocket = (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      socket.on('joinChat', (chatId) => {
        socket.join(chatId);
      });
  
      socket.on('sendMessage', (message) => {
        io.to(message.chatId).emit('message', message);
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
};