const express = require('express');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const path = require('path');

// Shared session configuration
const sessionConfig = {
  secret: 'smartview-cctv-secret-key-2024',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 }
};

// --- App 1: SmartView CCTV Platform (Port 3000) ---
const cctvApp = express();
cctvApp.use(cors());
cctvApp.use(express.json());
cctvApp.use(express.urlencoded({ extended: true }));
cctvApp.use(session(sessionConfig));

// Serve static Vue3 SPA from public/cctv/
cctvApp.use(express.static(path.join(__dirname, 'public', 'cctv')));

cctvApp.use('/', require('./routes/cctv'));

// --- App 2: FRP Intranet Management Panel (Port 3001) ---
const frpApp = express();
frpApp.use(cors());
frpApp.use(express.json());
frpApp.use(express.urlencoded({ extended: true }));
frpApp.use(session(sessionConfig));

frpApp.set('view engine', 'ejs');
frpApp.set('views', __dirname + '/views/frp');

frpApp.use('/', require('./routes/frp'));

// --- App 3: Internal Data API (Port 8080) ---
const dataApp = express();
dataApp.use(cors());
dataApp.use(express.json());
dataApp.use(express.urlencoded({ extended: true }));
dataApp.use(session(sessionConfig));

dataApp.use('/', require('./routes/data'));

// --- Start all three servers ---
http.createServer(cctvApp).listen(3000, () => {
  console.log('[CCTV] SmartView CCTV v3.2.1 listening on port 3000');
});

http.createServer(frpApp).listen(3001, () => {
  console.log('[FRP] FRP内网穿透管理系统 listening on port 3001');
});

http.createServer(dataApp).listen(8080, () => {
  console.log('[DATA] Internal Data API listening on port 8080');
});
