# AGENTS Instructions

## 项目目标
- 这是一个**独立**的 Pintia/PTA MCP + Codex Skill 项目。
- 仅参考 `vscode-pintia` 的接口设计思路，不修改其仓库代码。

## 安全边界
- 严禁在代码、日志、文档、测试快照中泄露 cookie/token/密码。
- 敏感配置仅通过环境变量或本地未跟踪文件注入。
- 不实现绕过登录、验证码、风控或平台限制的能力。

## 代码风格
- TypeScript strict。
- 类型清晰，避免 `any`。
- 小函数、单一职责。
- 错误处理必须明确并带可诊断信息。

## 构建命令
- `pnpm install`
- `pnpm build`
- `pnpm test`

## 测试要求
- `pintia-client` 类型检查。
- `pintia-mcp-server` 可启动（smoke test）。
- MCP tool schema 可用。
- 日志/序列化中无敏感信息输出。

## 禁止事项
- 不要把 cookie 写入 README。
- 不要提交 `.env`。
