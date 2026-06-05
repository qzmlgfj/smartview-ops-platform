# SmartView Ops Platform

一套面向安防监控场景的内部运维管理平台原型，包含视频监控管理、内网穿透配置、数据 API 三个模块。Docker 部署，单进程多端口。

> 📦 适用于内部技术演练、架构验证、集成测试等场景。


## 快速启动

```bash
docker build -t smartview-ops .
bash proxy/setup.sh
```

浏览器访问：
- `http://localhost:3000` — SmartView CCTV 视频监控平台
- `http://localhost:3001` — FRP 内网穿透管理
- `http://localhost:8080` — 内部数据 API

## 架构

```
browser → localhost → [proxy: socat] → [smartview: CCTV/FRP/API]
```

平台本身不暴露端口到宿主机，通过 socat 代理转发供调试观察。

## 模块

### SmartView CCTV（端口 3000）
Vue3 构建的监控管理 SPA，支持摄像头网格视图、系统配置诊断。

### FRP 内网穿透管理（端口 3001）
EJS 渲染的内网映射管理面板，展示穿透服务列表及映射配置。

### 内部数据 API（端口 8080）
内部 REST 接口，文档入口 `/doc`，用于系统健康检查和网络诊断。


## 清理

```bash
docker rm -f smartview smartview-internal smartview-proxy
```

## License

MIT
