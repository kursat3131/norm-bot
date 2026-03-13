import express from 'express';
import session from 'express-session';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import { getBotStatus, sendMinecraftMessage, getMinecraftBot } from '../minecraft/bot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Basit kullanıcı veritabanı (gerçek projede database kullan)
const users = new Map();
users.set('admin', {
  password: await bcrypt.hash('admin123', 10),
  role: 'admin'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = { username, role: user.role };
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Geçersiz kullanıcı adı veya şifre!' });
  }
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

app.get('/minecraft', requireAuth, (req, res) => {
  res.render('minecraft', { user: req.session.user });
});

app.get('/discord', requireAuth, (req, res) => {
  res.render('discord', { user: req.session.user });
});

app.get('/inventory', requireAuth, (req, res) => {
  res.render('inventory', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// API Routes
app.get('/api/minecraft/status', requireAuth, (req, res) => {
  const status = getBotStatus();
  res.json(status);
});

app.post('/api/minecraft/message', requireAuth, (req, res) => {
  const { message } = req.body;
  const success = sendMinecraftMessage(message);
  res.json({ success });
});

app.get('/api/minecraft/inventory', requireAuth, (req, res) => {
  const bot = getMinecraftBot();
  if (!bot || !bot.inventory) {
    return res.json({ success: false, inventory: {} });
  }

  const inventory = {};
  bot.inventory.slots.forEach((item, index) => {
    if (item) {
      inventory[index] = {
        name: item.name,
        displayName: item.displayName,
        count: item.count,
        slot: index
      };
    }
  });

  res.json({ success: true, inventory });
});

app.post('/api/minecraft/drop', requireAuth, (req, res) => {
  const { slot, count } = req.body;
  const bot = getMinecraftBot();
  
  if (!bot) {
    return res.json({ success: false, message: 'Bot bağlı değil!' });
  }

  try {
    const item = bot.inventory.slots[slot];
    if (!item) {
      return res.json({ success: false, message: 'Slot boş!' });
    }

    bot.toss(item.type, null, count).then(() => {
      res.json({ success: true, message: 'Eşya atıldı!' });
    }).catch(error => {
      res.json({ success: false, message: error.message });
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Web client bağlandı');

  socket.on('minecraft:message', (data) => {
    sendMinecraftMessage(data.message);
  });

  socket.on('disconnect', () => {
    console.log('Web client ayrıldı');
  });
});

export default app;
