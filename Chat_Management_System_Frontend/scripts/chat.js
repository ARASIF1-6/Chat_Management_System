document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      window.location.href = '/login';
      return;
    }
  
    const socket = io('http://localhost:5000');
    let currentChatId = null;
  
    const chatListItems = document.getElementById('chat-list-items');
    const chatMessages = document.getElementById('chat-messages');
    const chatName = document.getElementById('chat-name');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const logoutBtn = document.getElementById('logout-btn');
  
    const loadChats = async () => {
      const response = await fetch(`http://localhost:5000/api/chats/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      chatListItems.innerHTML = '';
      data.chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.textContent = chat.name || 'Chat';
        chatItem.addEventListener('click', () => loadMessages(chat.id, chat.name));
        chatListItems.appendChild(chatItem);
      });
    };
  
    const loadMessages = async (chatId, name) => {
      currentChatId = chatId;
      chatName.textContent = name || 'Chat';
      const response = await fetch(`http://localhost:5000/api/chats/messages/${chatId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      chatMessages.innerHTML = '';
      data.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', msg.senderId === user.id ? 'sent' : 'received');
        messageDiv.innerHTML = `<div class="content">${msg.content}</div>`;
        chatMessages.appendChild(messageDiv);
      });
      socket.emit('joinChat', chatId);
    };
  
    socket.on('message', (message) => {
      if (message.chatId === currentChatId) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', message.senderId === user.id ? 'sent' : 'received');
        messageDiv.innerHTML = `<div class="content">${message.content}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    });
  
    sendBtn.addEventListener('click', async () => {
      const content = messageInput.value.trim();
      if (content && currentChatId) {
        const message = { chatId: currentChatId, senderId: user.id, content };
        await fetch('http://localhost:5000/api/chats/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(message),
        });
        socket.emit('sendMessage', message);
        messageInput.value = '';
      }
    });
  
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  
    await loadChats();
  });