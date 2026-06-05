const express = require('express');
const router = express.Router();

// Auth middleware — checks if session has authenticated flag
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  return res.status(401).send('Unauthorized');
}

// Hardcoded mapping table data (5 rows)
const mappings = [
  {
    id: 1,
    name: '视频监控服务器',
    localAddress: '10.0.0.10',
    localPort: 3000,
    remotePort: 3000,
    protocol: 'TCP',
    status: '运行中'
  },
  {
    id: 2,
    name: '数据API服务',
    localAddress: '10.0.0.11',
    localPort: 8080,
    remotePort: 8080,
    protocol: 'TCP',
    status: '运行中'
  },
  {
    id: 3,
    name: '跳板机-核心生产网段',
    localAddress: '10.0.0.3',
    localPort: 22,
    remotePort: 60022,
    protocol: 'TCP',
    status: '运行中',
    note: 'root/P@ssFrp2024'
  },
  {
    id: 4,
    name: 'PLC控制器-1',
    localAddress: '10.0.2.1',
    localPort: 102,
    remotePort: 60102,
    protocol: 'TCP',
    status: '运行中'
  },
  {
    id: 5,
    name: 'PLC控制器-2',
    localAddress: '10.0.2.2',
    localPort: 102,
    remotePort: 60202,
    protocol: 'TCP',
    status: '运行中'
  }
];

// GET / — render login page (no auth required)
router.get('/', (req, res) => {
  res.render('login');
});

// GET /dashboard — render dashboard (auth required)
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { mappings });
});

// POST /api/login — session-based authentication
// Valid credentials: admin / SmartView@2024 (synced with CCTV platform)
router.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (username === 'admin' && password === 'SmartView@2024') {
    req.session.authenticated = true;
    req.session.username = username;
    return res.json({ success: true, message: 'Login successful', username });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;
