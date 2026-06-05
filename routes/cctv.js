const express = require('express');
const router = express.Router();

// Auth middleware — checks if session has authenticated flag
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

// GET /api/users — USER LIST LEAK (Vulnerability 0, no auth required)
// Returns plaintext credentials for all platform users
router.get('/api/users', (req, res) => {
  res.json([
    { id: 1, username: 'admin', password: 'SmartView@2024', role: '超级管理员', lastLogin: '2026-06-05 08:12:33' },
    { id: 2, username: 'operator', password: 'SV_operator_2024', role: '操作员', lastLogin: '2026-06-04 22:45:10' },
    { id: 3, username: 'viewer', password: 'viewer123', role: '只读用户', lastLogin: '2026-05-28 14:30:01' }
  ]);
});

// POST /api/login — session-based authentication
// Valid credentials: admin / SmartView@2024 (exposed via /api/users)
router.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (username === 'admin' && password === 'SmartView@2024') {
    req.session.authenticated = true;
    req.session.username = username;
    return res.json({ success: true, message: 'Login successful', username });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

// GET /api/cameras — returns 102 fake camera records (auth required)
router.get('/api/cameras', requireAuth, (req, res) => {
  const locations = [
    '主入口', '东门', '西门', '南门', '北门', '后门',
    '停车场A区', '停车场B区', '停车场C区', '停车场D区',
    '大堂', '走廊东', '走廊西', '走廊南', '走廊北',
    '电梯1号', '电梯2号', '电梯3号', '电梯4号',
    '楼梯间1', '楼梯间2', '楼梯间3',
    '机房A', '机房B', '配电室', '空调机房',
    '仓库1', '仓库2', '仓库3',
    '食堂', '健身房', '会议室A', '会议室B', '会议室C',
    '办公室101', '办公室102', '办公室103', '办公室104',
    '办公室201', '办公室202', '办公室203', '办公室204',
    '办公室301', '办公室302', '办公室303', '办公室304',
    '前台', '接待区', '休息区',
    '围墙东段', '围墙西段', '围墙南段', '围墙北段',
    '天台', '地下室入口', '卸货区',
    '研发中心A', '研发中心B', '测试间', '服务器机房',
    '档案室', '财务室', '人事部', '安保中心',
    '消防通道1', '消防通道2', '消防通道3', '消防通道4',
    '锅炉房', '水泵房', '垃圾处理区',
    '吸烟区', '自行车棚', '访客停车区',
    '监控中心', '应急指挥室', '通信机房',
    '园区入口', '园区东侧', '园区西侧', '园区南侧', '园区北侧',
    '排水泵站', '变电站A', '变电站B',
    '危险品仓库', '冷库', '干燥间',
    '质检室', '生产线1', '生产线2', '生产线3',
    '包装区', '成品仓库', '原料仓库',
    '废气处理', '污水处理', '纯水站',
    '空压站', '冷冻站', '换热站',
    '研发实验室1'
  ];

  const statuses = ['online', 'online', 'online', 'online', 'offline', 'warning'];

  const cameras = locations.map((name, idx) => ({
    id: idx + 1,
    name: `摄像头-${name}`,
    status: statuses[idx % statuses.length]
  }));

  res.json(cameras);
});

// GET /api/diagnosis — DIAGNOSTIC CONFIG LEAK (Vulnerability 1)
// Returns internal service addresses, database credentials, and FRP default password note
router.get('/api/diagnosis', requireAuth, (req, res) => {
  res.json({
    platform: 'SmartView CCTV v3.2.1',
    diagnosis_time: new Date().toISOString(),
    database: {
      host: '10.0.0.50',
      port: 3306,
      username: 'monitor',
      password: 'MonDB@2024',
      database: 'cctv_monitor'
    },
    frp_manager: 'http://10.0.0.12:3001',
    internal_services: {
      frp_panel: {
        url: 'http://10.0.0.12:3001',
        note: 'FRP内网穿透管理系统，凭据与CCTV平台同步，使用相同管理员账号密码登录'
      },
      data_api: {
        url: 'http://10.0.0.11:8080',
        note: '内部数据API服务，无需认证'
      }
    }
  });
});

module.exports = router;
