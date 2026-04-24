# pintia-mcp-skill

独立的 Pintia/PTA 学习辅助项目，包含：
- `pintia-client`：不依赖 VS Code 的 TypeScript API 客户端。
- `pintia-mcp-server`：通过 STDIO 提供 MCP tools 给 Codex CLI。
- `pintia-learning-assistant` Skill：规范解题分析、代码草稿和本地样例测试流程。

> 这是全新项目，不是 `vscode-pintia` 插件改造。仅参考其功能设计和 API 思路。

## 功能列表
- 登录态检查、题集查询、题目搜索、题面获取、样例获取、提交结果查询。
- 可选真实提交工具 `pintia_submit_solution`（需用户明确触发）。
- 本地样例执行工具 `pintia_run_local_samples`（cpp/python/java）。
- 默认内置安全边界：拒绝验证码/登录/限流绕过、拒绝考试作弊和无人值守批量刷题。

## 快速开始
```bash
pnpm install
pnpm build
pnpm test
```

## 环境变量
- `PINTIA_COOKIE`（推荐）
- `PINTIA_BASE_URL`（可选）
- `PINTIA_USER_AGENT`（可选）
- `PINTIA_TIMEOUT_MS`（可选，默认 10000）

## MCP 配置示例
见 `examples/codex-config.example.toml` 与 `docs/codex-setup.md`。

## Skill 使用方式
- 在项目根目录运行 `codex`。
- 显式调用：`$pintia-learning-assistant`。
- 或自然语言提出 PTA 题目分析/调试请求。

## 安全说明
- 不要将 cookie/token/password 写入代码、README、日志或测试快照。
- 建议在容器/沙箱中运行陌生代码，再调用 `pintia_run_local_samples`。
