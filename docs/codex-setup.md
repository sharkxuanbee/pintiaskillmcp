# Codex CLI 接入指南

## 1) 安装依赖
```bash
pnpm install
```

## 2) 构建
```bash
pnpm build
```

## 3) 设置环境变量
```bash
export PINTIA_COOKIE="your-cookie-here"
```

## 4) Codex CLI MCP 配置示例
```toml
[mcp_servers.pintia]
command = "node"
args = ["/absolute/path/to/pintia-mcp-skill/packages/pintia-mcp-server/dist/index.js"]
env = { PINTIA_COOKIE = "replace-with-your-cookie" }
```

## 5) 在 Codex 中检查 MCP
1. 启动 `codex`
2. 使用 `/mcp` 查看 server 注册情况
3. 让 Codex 调用 `pintia_get_login_status`

## 6) 使用 Skill
1. 在项目根目录启动 `codex`
2. 显式调用 `$pintia-learning-assistant`
3. 或用自然语言请求分析某道 Pintia/PTA 题
