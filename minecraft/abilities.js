import pathfinderPlugin from 'mineflayer-pathfinder';
import * as memory from './memory.js';

const { goals } = pathfinderPlugin;

// Bot yetenekleri - AI'nın kullanabileceği fonksiyonlar
export class BotAbilities {
  constructor(bot) {
    this.bot = bot;
    this.currentTask = null;
  }

  // Oyuncuya git
  async goToPlayer(username) {
    try {
      const player = this.bot.players[username]?.entity;
      if (!player) {
        return { success: false, message: `${username} bulunamadı!` };
      }

      console.log(`[Pathfinding] ${username} yanına gidiyorum...`);
      const goal = new goals.GoalNear(player.position.x, player.position.y, player.position.z, 2);
      
      this.bot.pathfinder.setGoal(goal);
      
      // Hedefe ulaşana kadar bekle (max 30 saniye)
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.bot.pathfinder.setGoal(null);
          resolve({ success: false, message: 'Zaman aşımı!' });
        }, 30000);

        this.bot.once('goal_reached', () => {
          clearTimeout(timeout);
          resolve({ success: true, message: `${username} yanına geldim!` });
        });

        this.bot.once('path_update', (results) => {
          if (results.status === 'noPath') {
            clearTimeout(timeout);
            this.bot.pathfinder.setGoal(null);
            resolve({ success: false, message: 'Yol bulunamadı!' });
          }
        });
      });
    } catch (error) {
      console.error('goToPlayer hatası:', error);
      return { success: false, message: 'Bir hata oluştu!' };
    }
  }

  // Belirli koordinata git
  async goToPosition(x, y, z) {
    try {
      console.log(`[Pathfinding] (${x}, ${y}, ${z}) koordinatına gidiyorum...`);
      const goal = new goals.GoalNear(parseFloat(x), parseFloat(y), parseFloat(z), 1);
      
      this.bot.pathfinder.setGoal(goal);
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.bot.pathfinder.setGoal(null);
          resolve({ success: false, message: 'Zaman aşımı!' });
        }, 60000);

        this.bot.once('goal_reached', () => {
          clearTimeout(timeout);
          resolve({ success: true, message: `Hedefe ulaştım! (${x}, ${y}, ${z})` });
        });

        this.bot.once('path_update', (results) => {
          if (results.status === 'noPath') {
            clearTimeout(timeout);
            this.bot.pathfinder.setGoal(null);
            resolve({ success: false, message: 'Yol bulunamadı!' });
          }
        });
      });
    } catch (error) {
      console.error('goToPosition hatası:', error);
      return { success: false, message: 'Bir hata oluştu!' };
    }
  }

  // Oyuncuyu takip et
  async followPlayer(username) {
    const player = this.bot.players[username]?.entity;
    if (!player) {
      return { success: false, message: `${username} bulunamadı!` };
    }

    this.currentTask = 'follow';
    const followInterval = setInterval(() => {
      if (this.currentTask !== 'follow') {
        clearInterval(followInterval);
        return;
      }

      const target = this.bot.players[username]?.entity;
      if (target) {
        const goal = new goals.GoalNear(target.position.x, target.position.y, target.position.z, 2);
        this.bot.pathfinder.setGoal(goal, true);
      }
    }, 1000);

    return { success: true, message: `${username} takip ediyorum!` };
  }

  // Takibi durdur
  stopFollowing() {
    this.currentTask = null;
    this.bot.pathfinder.setGoal(null);
    return { success: true, message: 'Takibi durdurdum!' };
  }

  // Blok kır
  async breakBlock(blockName) {
    const block = this.bot.findBlock({
      matching: (b) => b.name.includes(blockName),
      maxDistance: 32
    });

    if (!block) {
      return { success: false, message: `${blockName} bulunamadı!` };
    }

    try {
      await this.bot.dig(block);
      return { success: true, message: `${blockName} kırdım!` };
    } catch (error) {
      return { success: false, message: 'Kıramadım!' };
    }
  }

  // Blok yerleştir
  async placeBlock(blockName, x, y, z) {
    const item = this.bot.inventory.items().find(i => i.name.includes(blockName));
    if (!item) {
      return { success: false, message: `Envanterimde ${blockName} yok!` };
    }

    try {
      const referenceBlock = this.bot.blockAt({ x, y: y - 1, z });
      await this.bot.equip(item, 'hand');
      await this.bot.placeBlock(referenceBlock, { x: 0, y: 1, z: 0 });
      return { success: true, message: `${blockName} yerleştirdim!` };
    } catch (error) {
      return { success: false, message: 'Yerleştiremedim!' };
    }
  }

  // Eşya topla
  async collectItem(itemName) {
    const item = this.bot.nearestEntity(entity => {
      return entity.name === 'item' && 
             entity.metadata && 
             entity.metadata[8]?.itemId;
    });

    if (!item) {
      return { success: false, message: `${itemName} bulunamadı!` };
    }

    try {
      const goal = new goals.GoalNear(item.position.x, item.position.y, item.position.z, 1);
      await this.bot.pathfinder.goto(goal);
      return { success: true, message: `${itemName} topladım!` };
    } catch (error) {
      return { success: false, message: 'Toplayamadım!' };
    }
  }

  // Zıpla
  jump() {
    this.bot.setControlState('jump', true);
    setTimeout(() => this.bot.setControlState('jump', false), 500);
    return { success: true, message: 'Zıpladım!' };
  }

  // Eğil
  sneak(enable = true) {
    this.bot.setControlState('sneak', enable);
    return { success: true, message: enable ? 'Eğildim!' : 'Kalktım!' };
  }

  // Koş
  sprint(enable = true) {
    this.bot.setControlState('sprint', enable);
    return { success: true, message: enable ? 'Koşuyorum!' : 'Yürüyorum!' };
  }

  // Envanter göster
  showInventory() {
    const items = this.bot.inventory.items().map(item => {
      return `${item.name} x${item.count}`;
    });

    if (items.length === 0) {
      return { success: true, message: 'Envanterim boş!' };
    }

    return { success: true, message: `Envanterim:\n${items.join('\n')}` };
  }

  // Sağlık durumu
  getHealth() {
    return {
      success: true,
      message: `Can: ${this.bot.health}/20, Açlık: ${this.bot.food}/20`
    };
  }

  // Yakındaki oyuncular
  getNearbyPlayers() {
    const players = Object.keys(this.bot.players).filter(name => name !== this.bot.username);
    
    if (players.length === 0) {
      return { success: true, message: 'Yakında kimse yok!' };
    }

    return { success: true, message: `Yakındaki oyuncular: ${players.join(', ')}` };
  }

  // Yakındaki moblar
  getNearbyMobs() {
    const mobs = Object.values(this.bot.entities).filter(entity => {
      return entity.type === 'mob' && entity.position.distanceTo(this.bot.entity.position) < 16;
    });

    if (mobs.length === 0) {
      return { success: true, message: 'Yakında mob yok!' };
    }

    const mobList = mobs.map(mob => mob.name || mob.displayName).join(', ');
    return { success: true, message: `Yakındaki moblar: ${mobList}` };
  }

  // Saldır
  async attack(targetName) {
    const entity = this.bot.nearestEntity(e => {
      return (e.name === targetName || e.displayName === targetName) && 
             e.position.distanceTo(this.bot.entity.position) < 16;
    });

    if (!entity) {
      return { success: false, message: `${targetName} bulunamadı!` };
    }

    try {
      await this.bot.attack(entity);
      return { success: true, message: `${targetName} saldırdım!` };
    } catch (error) {
      return { success: false, message: 'Saldıramadım!' };
    }
  }

  // Yemek ye
  async eat() {
    const food = this.bot.inventory.items().find(item => {
      return item.name.includes('bread') || 
             item.name.includes('apple') || 
             item.name.includes('meat') ||
             item.name.includes('fish');
    });

    if (!food) {
      return { success: false, message: 'Yiyecek yok!' };
    }

    try {
      await this.bot.equip(food, 'hand');
      await this.bot.consume();
      return { success: true, message: `${food.name} yedim!` };
    } catch (error) {
      return { success: false, message: 'Yiyemedim!' };
    }
  }

  // Dur
  stop() {
    this.bot.pathfinder.setGoal(null);
    this.bot.clearControlStates();
    this.currentTask = null;
    return { success: true, message: 'Durdum!' };
  }

  // Etrafı bak
  lookAround() {
    const yaw = Math.random() * Math.PI * 2;
    this.bot.look(yaw, 0);
    return { success: true, message: 'Etrafıma bakıyorum!' };
  }

  // Oyuncuya bak
  lookAtPlayer(username) {
    const player = this.bot.players[username]?.entity;
    if (!player) {
      return { success: false, message: `${username} bulunamadı!` };
    }

    this.bot.lookAt(player.position.offset(0, player.height, 0));
    return { success: true, message: `${username} bakıyorum!` };
  }

  // Madencilik - Belirli bloktan kaz
  async mineBlock(blockName, count = 1) {
    try {
      let mined = 0;
      
      for (let i = 0; i < count; i++) {
        const block = this.bot.findBlock({
          matching: (b) => b.name.toLowerCase().includes(blockName.toLowerCase()),
          maxDistance: 32
        });

        if (!block) {
          return { success: false, message: `${blockName} bulunamadı! ${mined} adet kazıldı.` };
        }

        // Bloğa git
        const goal = new goals.GoalNear(block.position.x, block.position.y, block.position.z, 3);
        await this.bot.pathfinder.goto(goal);

        // Kaz
        await this.bot.dig(block);
        mined++;
      }

      return { success: true, message: `${mined} adet ${blockName} kazıldı!` };
    } catch (error) {
      console.error('mineBlock hatası:', error);
      return { success: false, message: 'Kazma hatası!' };
    }
  }

  // Ağaç kes
  async chopTree() {
    try {
      const log = this.bot.findBlock({
        matching: (b) => b.name.includes('log'),
        maxDistance: 32
      });

      if (!log) {
        return { success: false, message: 'Ağaç bulunamadı!' };
      }

      // Ağaca git
      const goal = new goals.GoalNear(log.position.x, log.position.y, log.position.z, 3);
      await this.bot.pathfinder.goto(goal);

      // Tüm log bloklarını kaz
      let chopped = 0;
      while (true) {
        const nextLog = this.bot.findBlock({
          matching: (b) => b.name.includes('log'),
          maxDistance: 5,
          point: log.position
        });

        if (!nextLog) break;

        await this.bot.dig(nextLog);
        chopped++;

        if (chopped > 20) break; // Güvenlik limiti
      }

      return { success: true, message: `Ağaç kesildi! ${chopped} log toplandı.` };
    } catch (error) {
      return { success: false, message: 'Ağaç kesme hatası!' };
    }
  }

  // Crafting - Eşya yap
  async craftItem(itemName, count = 1) {
    try {
      const mcData = require('minecraft-data')(this.bot.version);
      const item = mcData.itemsByName[itemName];
      
      if (!item) {
        return { success: false, message: `${itemName} bulunamadı!` };
      }

      const recipe = this.bot.recipesFor(item.id, null, 1, null)[0];
      
      if (!recipe) {
        return { success: false, message: `${itemName} için tarif yok!` };
      }

      await this.bot.craft(recipe, count);
      return { success: true, message: `${count}x ${itemName} yapıldı!` };
    } catch (error) {
      return { success: false, message: 'Crafting hatası! Malzeme eksik olabilir.' };
    }
  }

  // Eşya at
  async dropItem(itemName, count = 1) {
    try {
      const item = this.bot.inventory.items().find(i => i.name.includes(itemName));
      
      if (!item) {
        return { success: false, message: `${itemName} envanterimde yok!` };
      }

      await this.bot.toss(item.type, null, count);
      return { success: true, message: `${count}x ${itemName} atıldı!` };
    } catch (error) {
      return { success: false, message: 'Atma hatası!' };
    }
  }

  // Sandık aç
  async openChest() {
    try {
      const chest = this.bot.findBlock({
        matching: (b) => b.name.includes('chest'),
        maxDistance: 32
      });

      if (!chest) {
        return { success: false, message: 'Sandık bulunamadı!' };
      }

      const chestWindow = await this.bot.openChest(chest);
      const items = chestWindow.containerItems();
      
      const itemList = items.map(item => `${item.name} x${item.count}`).join(', ');
      
      chestWindow.close();
      
      return { success: true, message: `Sandık içeriği: ${itemList || 'Boş'}` };
    } catch (error) {
      return { success: false, message: 'Sandık açma hatası!' };
    }
  }

  // Ekin ek
  async plantCrop(seedName) {
    try {
      const seed = this.bot.inventory.items().find(i => i.name.includes(seedName));
      
      if (!seed) {
        return { success: false, message: `${seedName} tohumu yok!` };
      }

      // Boş toprak bul
      const farmland = this.bot.findBlock({
        matching: (b) => b.name === 'farmland',
        maxDistance: 32
      });

      if (!farmland) {
        return { success: false, message: 'Ekilebilir toprak bulunamadı!' };
      }

      await this.bot.equip(seed, 'hand');
      await this.bot.placeBlock(farmland, { x: 0, y: 1, z: 0 });
      
      return { success: true, message: `${seedName} ekildi!` };
    } catch (error) {
      return { success: false, message: 'Ekim hatası!' };
    }
  }

  // Hasat yap
  async harvest(cropName) {
    try {
      const crop = this.bot.findBlock({
        matching: (b) => b.name.includes(cropName),
        maxDistance: 32
      });

      if (!crop) {
        return { success: false, message: `${cropName} bulunamadı!` };
      }

      await this.bot.dig(crop);
      return { success: true, message: `${cropName} hasat edildi!` };
    } catch (error) {
      return { success: false, message: 'Hasat hatası!' };
    }
  }

  // Balık tut
  async fish() {
    try {
      const fishingRod = this.bot.inventory.items().find(i => i.name.includes('fishing_rod'));
      
      if (!fishingRod) {
        return { success: false, message: 'Olta yok!' };
      }

      await this.bot.equip(fishingRod, 'hand');
      await this.bot.fish();
      
      return { success: true, message: 'Balık tuttum!' };
    } catch (error) {
      return { success: false, message: 'Balık tutma hatası!' };
    }
  }

  // Yatak kullan
  async sleep() {
    try {
      const bed = this.bot.findBlock({
        matching: (b) => b.name.includes('bed'),
        maxDistance: 32
      });

      if (!bed) {
        return { success: false, message: 'Yatak bulunamadı!' };
      }

      await this.bot.sleep(bed);
      return { success: true, message: 'Uyuyorum...' };
    } catch (error) {
      return { success: false, message: 'Uyuma hatası! Gece olmayabilir.' };
    }
  }

  // Uyan
  async wakeUp() {
    try {
      await this.bot.wake();
      return { success: true, message: 'Uyandım!' };
    } catch (error) {
      return { success: false, message: 'Zaten uyanığım!' };
    }
  }

  // Eşya değiş tokuş (Villager)
  async trade(villagerName) {
    try {
      const villager = this.bot.nearestEntity(e => {
        return e.name === 'villager' && e.position.distanceTo(this.bot.entity.position) < 16;
      });

      if (!villager) {
        return { success: false, message: 'Köylü bulunamadı!' };
      }

      const tradeWindow = await this.bot.openVillager(villager);
      const trades = tradeWindow.trades;
      
      const tradeList = trades.map((trade, i) => {
        return `${i + 1}. ${trade.inputItem1.name} -> ${trade.outputItem.name}`;
      }).join('\n');
      
      tradeWindow.close();
      
      return { success: true, message: `Ticaret seçenekleri:\n${tradeList}` };
    } catch (error) {
      return { success: false, message: 'Ticaret hatası!' };
    }
  }

  // Fırlatma (Bow)
  async shoot(targetName) {
    try {
      const bow = this.bot.inventory.items().find(i => i.name.includes('bow'));
      const arrow = this.bot.inventory.items().find(i => i.name.includes('arrow'));
      
      if (!bow || !arrow) {
        return { success: false, message: 'Yay veya ok yok!' };
      }

      const target = this.bot.nearestEntity(e => {
        return (e.name === targetName || e.displayName === targetName) && 
               e.position.distanceTo(this.bot.entity.position) < 32;
      });

      if (!target) {
        return { success: false, message: `${targetName} bulunamadı!` };
      }

      await this.bot.equip(bow, 'hand');
      await this.bot.lookAt(target.position.offset(0, target.height, 0));
      
      // Yayı çek ve fırlat
      this.bot.activateItem();
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.bot.deactivateItem();
      
      return { success: true, message: `${targetName} ok attım!` };
    } catch (error) {
      return { success: false, message: 'Ok atma hatası!' };
    }
  }

  // Zırh giy
  async equipArmor() {
    try {
      const armorSlots = ['head', 'torso', 'legs', 'feet'];
      let equipped = 0;

      for (const slot of armorSlots) {
        const armor = this.bot.inventory.items().find(i => {
          return i.name.includes('helmet') || 
                 i.name.includes('chestplate') || 
                 i.name.includes('leggings') || 
                 i.name.includes('boots');
        });

        if (armor) {
          await this.bot.equip(armor, slot);
          equipped++;
        }
      }

      return { success: true, message: `${equipped} parça zırh giyildi!` };
    } catch (error) {
      return { success: false, message: 'Zırh giyme hatası!' };
    }
  }

  // Konum kaydet
  saveLocation(name) {
    const pos = this.bot.entity.position;
    memory.rememberLocation(name, pos, `${name} konumu`);
    return { success: true, message: `${name} konumu kaydedildi! (${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)})` };
  }

  // Kayıtlı konuma git
  async goToSavedLocation(name) {
    const location = memory.getLocation(name);
    
    if (!location) {
      return { success: false, message: `${name} konumu bulunamadı!` };
    }

    const pos = location.position;
    return await this.goToPosition(pos.x, pos.y, pos.z);
  }

  // Blok say (belirli bloktan kaç tane var)
  countBlocks(blockName, radius = 32) {
    const blocks = this.bot.findBlocks({
      matching: (b) => b.name.toLowerCase().includes(blockName.toLowerCase()),
      maxDistance: radius,
      count: 999
    });

    return { success: true, message: `${radius} blok içinde ${blocks.length} adet ${blockName} var!` };
  }

  // En yakın bloğu bul
  findNearestBlock(blockName) {
    const block = this.bot.findBlock({
      matching: (b) => b.name.toLowerCase().includes(blockName.toLowerCase()),
      maxDistance: 64
    });

    if (!block) {
      return { success: false, message: `${blockName} bulunamadı!` };
    }

    const distance = Math.floor(this.bot.entity.position.distanceTo(block.position));
    return { success: true, message: `En yakın ${blockName}: ${distance} blok uzakta (${Math.floor(block.position.x)}, ${Math.floor(block.position.y)}, ${Math.floor(block.position.z)})` };
  }

  // Fırın kullan
  async useFurnace() {
    try {
      const furnace = this.bot.findBlock({
        matching: (b) => b.name.includes('furnace'),
        maxDistance: 32
      });

      if (!furnace) {
        return { success: false, message: 'Fırın bulunamadı!' };
      }

      const furnaceWindow = await this.bot.openFurnace(furnace);
      const items = furnaceWindow.containerItems();
      
      furnaceWindow.close();
      
      return { success: true, message: `Fırın açıldı! ${items.length} eşya var.` };
    } catch (error) {
      return { success: false, message: 'Fırın açma hatası!' };
    }
  }

  // Kova doldur
  async fillBucket(liquidType = 'water') {
    try {
      const bucket = this.bot.inventory.items().find(i => i.name === 'bucket');
      
      if (!bucket) {
        return { success: false, message: 'Kova yok!' };
      }

      const liquid = this.bot.findBlock({
        matching: (b) => b.name === liquidType,
        maxDistance: 32
      });

      if (!liquid) {
        return { success: false, message: `${liquidType} bulunamadı!` };
      }

      await this.bot.equip(bucket, 'hand');
      await this.bot.activateBlock(liquid);
      
      return { success: true, message: `Kova ${liquidType} ile dolduruldu!` };
    } catch (error) {
      return { success: false, message: 'Kova doldurma hatası!' };
    }
  }

  // Kova boşalt
  async emptyBucket() {
    try {
      const filledBucket = this.bot.inventory.items().find(i => 
        i.name.includes('water_bucket') || i.name.includes('lava_bucket')
      );
      
      if (!filledBucket) {
        return { success: false, message: 'Dolu kova yok!' };
      }

      await this.bot.equip(filledBucket, 'hand');
      
      const targetBlock = this.bot.blockAt(this.bot.entity.position.offset(1, -1, 0));
      await this.bot.activateBlock(targetBlock);
      
      return { success: true, message: 'Kova boşaltıldı!' };
    } catch (error) {
      return { success: false, message: 'Kova boşaltma hatası!' };
    }
  }

  // Kitap yaz
  async writeBook(text) {
    try {
      const book = this.bot.inventory.items().find(i => i.name.includes('writable_book'));
      
      if (!book) {
        return { success: false, message: 'Yazılabilir kitap yok!' };
      }

      await this.bot.writeBook(book.slot, [text]);
      return { success: true, message: 'Kitap yazıldı!' };
    } catch (error) {
      return { success: false, message: 'Kitap yazma hatası!' };
    }
  }

  // Tabela yaz
  async writeSign(text) {
    try {
      const sign = this.bot.findBlock({
        matching: (b) => b.name.includes('sign'),
        maxDistance: 5
      });

      if (!sign) {
        return { success: false, message: 'Tabela bulunamadı!' };
      }

      await this.bot.updateSign(sign, text);
      return { success: true, message: 'Tabela yazıldı!' };
    } catch (error) {
      return { success: false, message: 'Tabela yazma hatası!' };
    }
  }

  // Deneyim seviyesi
  getExperience() {
    return { 
      success: true, 
      message: `Seviye: ${this.bot.experience.level}, XP: ${this.bot.experience.points}/${this.bot.experience.pointsToNextLevel}` 
    };
  }

  // Hava durumu
  getWeather() {
    const weather = this.bot.isRaining ? '🌧️ Yağmurlu' : '☀️ Güneşli';
    const time = this.bot.time.timeOfDay;
    const timeStr = time < 6000 ? '🌅 Sabah' : time < 12000 ? '☀️ Öğlen' : time < 18000 ? '🌆 Akşam' : '🌙 Gece';
    
    return { success: true, message: `Hava: ${weather}, Zaman: ${timeStr}` };
  }

  // Biome bilgisi
  getBiome() {
    const biome = this.bot.blockAt(this.bot.entity.position)?.biome;
    return { success: true, message: `Biome: ${biome?.name || 'Bilinmiyor'}` };
  }

  // Yükseklik bilgisi
  getAltitude() {
    const y = Math.floor(this.bot.entity.position.y);
    let level = '';
    
    if (y < 0) level = '⛏️ Mağara';
    else if (y < 64) level = '🏔️ Yer altı';
    else if (y < 128) level = '🌍 Yer seviyesi';
    else level = '☁️ Yüksek';
    
    return { success: true, message: `Yükseklik: ${y} ${level}` };
  }

  // Yakındaki blokları listele
  listNearbyBlocks(radius = 5) {
    const blocks = {};
    const pos = this.bot.entity.position;
    
    for (let x = -radius; x <= radius; x++) {
      for (let y = -radius; y <= radius; y++) {
        for (let z = -radius; z <= radius; z++) {
          const block = this.bot.blockAt(pos.offset(x, y, z));
          if (block && block.name !== 'air') {
            blocks[block.name] = (blocks[block.name] || 0) + 1;
          }
        }
      }
    }

    const list = Object.entries(blocks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => `${name}: ${count}`)
      .join(', ');

    return { success: true, message: `Yakındaki bloklar: ${list}` };
  }

  // Işınlanma noktası kaydet (respawn)
  async setSpawn() {
    try {
      const bed = this.bot.findBlock({
        matching: (b) => b.name.includes('bed'),
        maxDistance: 5
      });

      if (!bed) {
        return { success: false, message: 'Yakında yatak yok!' };
      }

      await this.bot.sleep(bed);
      await this.bot.wake();
      
      return { success: true, message: 'Spawn noktası ayarlandı!' };
    } catch (error) {
      return { success: false, message: 'Spawn ayarlama hatası!' };
    }
  }

  // Eşya takas et
  async swapItems(slot1, slot2) {
    try {
      await this.bot.clickWindow(slot1, 0, 0);
      await this.bot.clickWindow(slot2, 0, 0);
      await this.bot.clickWindow(slot1, 0, 0);
      
      return { success: true, message: 'Eşyalar takas edildi!' };
    } catch (error) {
      return { success: false, message: 'Takas hatası!' };
    }
  }

  // Eşya birleştir (stack)
  async stackItems(itemName) {
    try {
      const items = this.bot.inventory.items().filter(i => i.name.includes(itemName));
      
      if (items.length < 2) {
        return { success: false, message: 'Birleştirilecek eşya yok!' };
      }

      // İlk eşyayı al
      await this.bot.clickWindow(items[0].slot, 0, 0);
      // İkinci eşyaya tıkla (birleştir)
      await this.bot.clickWindow(items[1].slot, 0, 0);
      
      return { success: true, message: `${itemName} birleştirildi!` };
    } catch (error) {
      return { success: false, message: 'Birleştirme hatası!' };
    }
  }

  // Eşya say
  countItem(itemName) {
    const items = this.bot.inventory.items().filter(i => i.name.includes(itemName));
    const total = items.reduce((sum, item) => sum + item.count, 0);
    
    return { success: true, message: `${itemName}: ${total} adet` };
  }

  // Boş slot say
  countEmptySlots() {
    const empty = this.bot.inventory.emptySlotCount();
    return { success: true, message: `Boş slot: ${empty}` };
  }

  // Yakıt ekle (fırın)
  async addFuel() {
    try {
      const furnace = this.bot.findBlock({
        matching: (b) => b.name.includes('furnace'),
        maxDistance: 5
      });

      if (!furnace) {
        return { success: false, message: 'Fırın bulunamadı!' };
      }

      const fuel = this.bot.inventory.items().find(i => 
        i.name.includes('coal') || i.name.includes('wood') || i.name.includes('stick')
      );

      if (!fuel) {
        return { success: false, message: 'Yakıt yok!' };
      }

      const furnaceWindow = await this.bot.openFurnace(furnace);
      await furnaceWindow.putFuel(fuel.type, null, 1);
      furnaceWindow.close();
      
      return { success: true, message: 'Yakıt eklendi!' };
    } catch (error) {
      return { success: false, message: 'Yakıt ekleme hatası!' };
    }
  }

  // Zırh çıkar
  async unequipArmor() {
    try {
      const armorSlots = ['head', 'torso', 'legs', 'feet'];
      let removed = 0;

      for (const slot of armorSlots) {
        try {
          await this.bot.unequip(slot);
          removed++;
        } catch (e) {
          // Slot boş
        }
      }

      return { success: true, message: `${removed} parça zırh çıkarıldı!` };
    } catch (error) {
      return { success: false, message: 'Zırh çıkarma hatası!' };
    }
  }

  // Kalkan kullan
  useShield() {
    try {
      const shield = this.bot.inventory.items().find(i => i.name.includes('shield'));
      
      if (!shield) {
        return { success: false, message: 'Kalkan yok!' };
      }

      this.bot.equip(shield, 'off-hand');
      return { success: true, message: 'Kalkan kuşanıldı!' };
    } catch (error) {
      return { success: false, message: 'Kalkan kullanma hatası!' };
    }
  }

  // Ateş yak (flint and steel)
  async lightFire() {
    try {
      const flintSteel = this.bot.inventory.items().find(i => i.name.includes('flint_and_steel'));
      
      if (!flintSteel) {
        return { success: false, message: 'Çakmak taşı yok!' };
      }

      await this.bot.equip(flintSteel, 'hand');
      
      const targetBlock = this.bot.blockAt(this.bot.entity.position.offset(1, 0, 0));
      await this.bot.activateBlock(targetBlock);
      
      return { success: true, message: 'Ateş yakıldı!' };
    } catch (error) {
      return { success: false, message: 'Ateş yakma hatası!' };
    }
  }

  // Su içinde mi kontrol
  isInWater() {
    const inWater = this.bot.entity.isInWater;
    return { success: true, message: inWater ? '💧 Su içindeyim!' : '🏃 Karadayım!' };
  }

  // Lav içinde mi kontrol
  isInLava() {
    const inLava = this.bot.entity.isInLava;
    return { success: true, message: inLava ? '🔥 LAV İÇİNDEYİM!' : '✅ Güvendeyim!' };
  }

  // Yere düşme mesafesi
  getFallDistance() {
    let distance = 0;
    const pos = this.bot.entity.position;
    
    for (let y = pos.y; y > 0; y--) {
      const block = this.bot.blockAt(pos.offset(0, -distance, 0));
      if (block && block.name !== 'air') break;
      distance++;
    }

    return { success: true, message: `Altımda ${distance} blok boşluk var!` };
  }

  // === YENİ ÖZELLIKLER (40+) ===

  // Belirli sayıda blok topla
  async collectBlocks(blockName, count = 10) {
    try {
      let collected = 0;
      for (let i = 0; i < count; i++) {
        const block = this.bot.findBlock({
          matching: (b) => b.name.includes(blockName),
          maxDistance: 32
        });
        if (!block) break;
        
        await this.bot.pathfinder.goto(new goals.GoalNear(block.position.x, block.position.y, block.position.z, 3));
        await this.bot.dig(block);
        collected++;
      }
      return { success: true, message: `${collected} adet ${blockName} toplandı!` };
    } catch (error) {
      return { success: false, message: 'Toplama hatası!' };
    }
  }

  async collectAllItems() {
    const items = Object.values(this.bot.entities).filter(e => e.name === 'item' && e.position.distanceTo(this.bot.entity.position) < 16);
    for (const item of items) {
      await this.bot.pathfinder.goto(new goals.GoalNear(item.position.x, item.position.y, item.position.z, 1));
    }
    return { success: true, message: `${items.length} eşya toplandı!` };
  }

  async goToHeight(y) {
    const pos = this.bot.entity.position;
    return await this.goToPosition(pos.x, parseFloat(y), pos.z);
  }

  async goToNearestBlock(blockName) {
    const block = this.bot.findBlock({
      matching: (b) => b.name.includes(blockName),
      maxDistance: 64
    });
    if (!block) return { success: false, message: `${blockName} bulunamadı!` };
    return await this.goToPosition(block.position.x, block.position.y, block.position.z);
  }

  getPosition() {
    const pos = this.bot.entity.position;
    return { success: true, message: `X:${Math.floor(pos.x)} Y:${Math.floor(pos.y)} Z:${Math.floor(pos.z)}` };
  }

  getTime() {
    const time = this.bot.time.timeOfDay;
    const hour = Math.floor((time / 1000 + 6) % 24);
    return { success: true, message: `Saat: ${hour}:00 (${time > 13000 ? '🌙 Gece' : '☀️ Gündüz'})` };
  }

  getXP() {
    return { success: true, message: `XP: Level ${this.bot.experience.level} (${this.bot.experience.points} puan)` };
  }

  countItem(itemName) {
    const items = this.bot.inventory.items().filter(i => i.name.includes(itemName));
    const total = items.reduce((sum, item) => sum + item.count, 0);
    return { success: true, message: `${itemName}: ${total} adet` };
  }

  async goToNearestPlayer() {
    const players = Object.values(this.bot.players).filter(p => p.entity && p.username !== this.bot.username);
    if (players.length === 0) return { success: false, message: 'Oyuncu yok!' };
    
    const nearest = players.reduce((prev, curr) => {
      const prevDist = prev.entity.position.distanceTo(this.bot.entity.position);
      const currDist = curr.entity.position.distanceTo(this.bot.entity.position);
      return currDist < prevDist ? curr : prev;
    });
    
    return await this.goToPlayer(nearest.username);
  }

  async randomWalk(distance = 10) {
    const angle = Math.random() * Math.PI * 2;
    const x = this.bot.entity.position.x + distance * Math.cos(angle);
    const z = this.bot.entity.position.z + distance * Math.sin(angle);
    return await this.goToPosition(x, this.bot.entity.position.y, z);
  }

  sayHello() {
    return { success: true, message: 'Merhaba! 👋' };
  }

  celebrate() {
    this.jump();
    setTimeout(() => this.jump(), 500);
    setTimeout(() => this.jump(), 1000);
    return { success: true, message: '🎉' };
  }

  // === YENİ MADENCİLİK KOMUTLARI ===

  // Collect: Blok topla, başlangıç noktasına dön ve at
  async collectAndReturn(blockName, count = 10) {
    try {
      // Başlangıç pozisyonunu kaydet
      const startPos = this.bot.entity.position.clone();
      console.log(`[Collect] Başlangıç: ${Math.floor(startPos.x)}, ${Math.floor(startPos.y)}, ${Math.floor(startPos.z)}`);
      
      let collected = 0;
      const collectedItems = [];

      for (let i = 0; i < count; i++) {
        // Bloğu bul
        const block = this.bot.findBlock({
          matching: (b) => b.name.toLowerCase().includes(blockName.toLowerCase()),
          maxDistance: 64
        });

        if (!block) {
          console.log(`[Collect] ${blockName} bulunamadı! ${collected} adet toplandı.`);
          break;
        }

        // Bloğa git
        console.log(`[Collect] ${blockName} bloğuna gidiyorum...`);
        const goal = new goals.GoalNear(block.position.x, block.position.y, block.position.z, 3);
        await this.bot.pathfinder.goto(goal);

        // Kaz
        console.log(`[Collect] Kazıyorum...`);
        await this.bot.dig(block);
        collected++;
        collectedItems.push(blockName);
      }

      // Başlangıç noktasına dön
      console.log(`[Collect] Başlangıç noktasına dönüyorum...`);
      await this.goToPosition(startPos.x, startPos.y, startPos.z);

      // Toplanan eşyaları at
      console.log(`[Collect] Eşyaları atıyorum...`);
      const item = this.bot.inventory.items().find(i => i.name.toLowerCase().includes(blockName.toLowerCase()));
      if (item) {
        await this.bot.toss(item.type, null, item.count);
      }

      return { 
        success: true, 
        message: `✅ ${collected} adet ${blockName} toplandı, başlangıç noktasına dönüldü ve atıldı!` 
      };
    } catch (error) {
      console.error('[Collect] Hata:', error);
      return { success: false, message: `❌ Toplama hatası: ${error.message}` };
    }
  }

  // Mine: Belirli koordinattaki bloğu kaz
  async mineAtCoordinate(x, y, z) {
    try {
      const targetPos = { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) };
      console.log(`[Mine] Hedef: ${Math.floor(targetPos.x)}, ${Math.floor(targetPos.y)}, ${Math.floor(targetPos.z)}`);

      // Bloğu al
      const block = this.bot.blockAt(targetPos);
      
      if (!block || block.name === 'air') {
        return { success: false, message: `❌ (${Math.floor(targetPos.x)}, ${Math.floor(targetPos.y)}, ${Math.floor(targetPos.z)}) koordinatında blok yok!` };
      }

      // Bloğa yaklaş
      console.log(`[Mine] ${block.name} bloğuna yaklaşıyorum...`);
      const goal = new goals.GoalNear(targetPos.x, targetPos.y, targetPos.z, 3);
      await this.bot.pathfinder.goto(goal);

      // Kaz
      console.log(`[Mine] ${block.name} kazıyorum...`);
      await this.bot.dig(block);

      return { 
        success: true, 
        message: `✅ (${Math.floor(targetPos.x)}, ${Math.floor(targetPos.y)}, ${Math.floor(targetPos.z)}) koordinatındaki ${block.name} kazıldı!` 
      };
    } catch (error) {
      console.error('[Mine] Hata:', error);
      return { success: false, message: `❌ Kazma hatası: ${error.message}` };
    }
  }
}

// AI için yetenek açıklamaları
export const abilityDescriptions = {
  // Hareket
  goToPlayer: 'Belirtilen oyuncunun yanına git',
  goToPosition: 'Belirtilen koordinata git (x, y, z)',
  followPlayer: 'Oyuncuyu takip et',
  stopFollowing: 'Takibi durdur',
  stop: 'Dur',
  jump: 'Zıpla',
  sneak: 'Eğil/Kalk',
  sprint: 'Koş/Yürü',
  
  // Etkileşim
  breakBlock: 'Blok kır',
  placeBlock: 'Blok yerleştir',
  collectItem: 'Eşya topla',
  attack: 'Saldır',
  lookAround: 'Etrafına bak',
  lookAtPlayer: 'Oyuncuya bak',
  
  // Envanter
  showInventory: 'Envanteri göster',
  dropItem: 'Eşya at (itemName, count)',
  openChest: 'Sandık aç ve içeriğini göster',
  equipArmor: 'Zırh giy',
  
  // Bilgi
  getHealth: 'Sağlık durumunu göster',
  getNearbyPlayers: 'Yakındaki oyuncuları listele',
  getNearbyMobs: 'Yakındaki mobları listele',
  
  // Madencilik & Toplama
  mineBlock: 'Belirli bloktan kaz (blockName, count)',
  chopTree: 'Ağaç kes',
  
  // Crafting & Üretim
  craftItem: 'Eşya yap (itemName, count)',
  
  // Farming
  plantCrop: 'Ekin ek (seedName)',
  harvest: 'Hasat yap (cropName)',
  
  // Diğer
  eat: 'Yemek ye',
  fish: 'Balık tut',
  sleep: 'Uyu',
  wakeUp: 'Uyan',
  trade: 'Köylü ile ticaret yap',
  shoot: 'Ok at (targetName)',
  
  // Konum
  saveLocation: 'Mevcut konumu kaydet (name)',
  goToSavedLocation: 'Kayıtlı konuma git (name)',
  
  // Yeni Özellikler (40+)
  collectBlocks: 'Belirli bloktan topla (blockName, count)',
  collectAllItems: 'Yakındaki tüm eşyaları topla',
  goToHeight: 'Belirli yüksekliğe git (y)',
  goToNearestBlock: 'En yakın bloğa git (blockName)',
  getPosition: 'Mevcut konumu söyle',
  getTime: 'Zamanı söyle',
  getXP: 'XP seviyesini söyle',
  countItem: 'Eşya sayısını söyle (itemName)',
  goToNearestPlayer: 'En yakın oyuncuya git',
  randomWalk: 'Rastgele yürü (distance)',
  sayHello: 'Merhaba de',
  celebrate: 'Kutlama yap (zıpla)',
  
  // Gelişmiş Madencilik
  collectAndReturn: 'Blok topla, başa dön ve at (blockName, count)',
  mineAtCoordinate: 'Koordinattaki bloğu kaz (x, y, z)'
};
