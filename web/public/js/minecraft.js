const socket = io();

// Bot durumunu güncelle
async function updateStatus() {
    const response = await fetch('/api/minecraft/status');
    const status = await response.json();
    
    const statusDiv = document.getElementById('bot-status');
    
    if (status.connected) {
        statusDiv.innerHTML = `
            <div style="color: green;">✅ Bağlı</div>
            <p>Kullanıcı: ${status.username}</p>
            <p>Can: ${status.health}/20 | Açlık: ${status.food}/20</p>
            <p>Oyuncu Sayısı: ${status.players}</p>
        `;
    } else {
        statusDiv.innerHTML = '<div style="color: red;">❌ Bağlı Değil</div>';
    }
}

// Mesaj gönder
function sendMessage() {
    const input = document.getElementById('message');
    const message = input.value.trim();
    
    if (message) {
        socket.emit('minecraft:message', { message });
        addChatMessage('Sen', message);
        input.value = '';
    }
}

// Chat'e mesaj ekle
function addChatMessage(username, message) {
    const chat = document.getElementById('chat');
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<strong>${username}:</strong> ${message}`;
    msgDiv.style.marginBottom = '10px';
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

// Enter tuşu ile gönder
document.getElementById('message').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Durumu her 5 saniyede güncelle
updateStatus();
setInterval(updateStatus, 5000);
