const socket = io();
let selectedSlot = null;
let inventory = {};

// Envanter yükle
async function refreshInventory() {
    try {
        const response = await fetch('/api/minecraft/inventory');
        const data = await response.json();
        
        if (data.success) {
            inventory = data.inventory;
            renderInventory();
        }
    } catch (error) {
        console.error('Envanter yükleme hatası:', error);
    }
}

// Envanteri render et
function renderInventory() {
    document.querySelectorAll('.inventory-slot').forEach((slot, index) => {
        const item = inventory[index];
        const content = slot.querySelector('.slot-content');
        const count = slot.querySelector('.slot-count');
        
        if (item) {
            // Minecraft item emoji/icon
            content.innerHTML = getItemIcon(item.name);
            count.textContent = item.count > 1 ? item.count : '';
            
            // Tooltip ekle
            slot.title = `${item.displayName || item.name}${item.count > 1 ? ' x' + item.count : ''}`;
        } else {
            content.innerHTML = '';
            count.textContent = '';
            slot.title = '';
        }
    });
}

// Minecraft item iconları
function getItemIcon(itemName) {
    const icons = {
        'stone': '🪨',
        'dirt': '🟫',
        'grass_block': '🟩',
        'wood': '🪵',
        'log': '🪵',
        'planks': '🟫',
        'cobblestone': '⬜',
        'diamond': '💎',
        'iron_ingot': '⚙️',
        'gold_ingot': '🟡',
        'coal': '⚫',
        'stick': '🦴',
        'sword': '⚔️',
        'pickaxe': '⛏️',
        'axe': '🪓',
        'shovel': '🔨',
        'apple': '🍎',
        'bread': '🍞',
        'cooked_beef': '🥩',
        'arrow': '➡️',
        'bow': '🏹',
        'torch': '🔦',
        'chest': '📦',
        'crafting_table': '🔨',
        'furnace': '🔥',
        'bucket': '🪣',
        'water_bucket': '💧',
        'lava_bucket': '🌋'
    };
    
    // İsimden icon bul
    for (const [key, icon] of Object.entries(icons)) {
        if (itemName.toLowerCase().includes(key)) {
            return icon;
        }
    }
    
    return '📦'; // Varsayılan icon
}

// Slot seç
document.addEventListener('click', (e) => {
    const slot = e.target.closest('.inventory-slot');
    if (slot) {
        // Önceki seçimi kaldır
        document.querySelectorAll('.inventory-slot').forEach(s => {
            s.classList.remove('selected');
        });
        
        // Yeni seçim
        slot.classList.add('selected');
        selectedSlot = parseInt(slot.dataset.slot);
    }
});

// Seçili eşyayı at
async function dropSelected() {
    if (selectedSlot === null) {
        alert('Önce bir slot seçin!');
        return;
    }
    
    const item = inventory[selectedSlot];
    if (!item) {
        alert('Bu slot boş!');
        return;
    }
    
    const count = prompt(`Kaç adet ${item.name} atmak istiyorsun?`, item.count);
    if (!count) return;
    
    try {
        const response = await fetch('/api/minecraft/drop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slot: selectedSlot, count: parseInt(count) })
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Eşya atıldı!');
            refreshInventory();
        }
    } catch (error) {
        console.error('Eşya atma hatası:', error);
    }
}

// Socket.IO ile gerçek zamanlı güncelleme
socket.on('inventory:update', (data) => {
    inventory = data.inventory;
    renderInventory();
});

// Sayfa yüklendiğinde envanteri yükle
refreshInventory();
setInterval(refreshInventory, 5000); // Her 5 saniyede yenile
