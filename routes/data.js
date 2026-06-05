const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

const startTime = Date.now();

// GET /doc — API DOCS LEAK (endpoint discovery, no auth)
router.get('/doc', (req, res) => {
  res.json({
    service: 'Internal Data API v1.0.0',
    description: '内部数据服务接口',
    endpoints: {
      '/api/health': 'GET — 服务健康检查',
      '/api/debug':  'GET — 系统诊断信息（环境变量、运行状态）',
      '/api/ping':   'GET — 网络连通性测试 (?host=<ip>)'
    },
    note: '内部服务，不需认证'
  });
});

// GET /api/health — health check endpoint
router.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// GET /api/debug — ENVIRONMENT VARIABLE LEAK (Vulnerability 4)
// Returns all process environment variables including REDIS_PASSWORD
router.get('/api/debug', (req, res) => {
  res.json({
    env: process.env,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || 'Redis@2024Internal',
    node_version: process.version,
    platform: process.platform,
    uptime: process.uptime()
  });
});

// GET /api/ping — COMMAND INJECTION (Vulnerability 5)
// Takes ?host= query param and passes it unsanitized to child_process.exec
router.get('/api/ping', (req, res) => {
  const host = req.query.host;

  if (!host) {
    return res.status(400).json({ error: 'host parameter is required' });
  }

  // VULNERABILITY: command injection via unsanitized child_process.exec
  // No input validation or escaping — attacker can inject arbitrary commands
  // e.g. /api/ping?host=127.0.0.1;id
  exec(`ping -c 4 ${host}`, { timeout: 10000 }, (error, stdout, stderr) => {
    res.json({
      output: stdout + (stderr ? '\n' + stderr : ''),
      error: error ? error.message : null
    });
  });
});

module.exports = router;
