# vscode-pintia 参考分析

## 参考来源
- 仓库：<https://github.com/jinzcdev/vscode-pintia>
- 公开说明（README / Marketplace）显示该项目是 **VS Code 插件**，能力包含登录、题目浏览、搜索、预览、测试和提交。

## 关键结论
1. 原项目定位：VS Code Extension（依赖编辑器 UI/命令系统）。
2. 当前新项目定位：独立 Node/TypeScript 工程，不依赖 VS Code API。
3. 参考策略：仅借鉴 API 流程与领域模型，不复制插件架构。
4. 目标形态：MCP Server + Codex Skill（CLI 自动化工作流）。

## 从参考项目抽象的能力清单
- 登录状态检查（Cookie 会话）。
- 题集列表与分页。
- 题目搜索。
- 题目详情/预览。
- 样例提取与本地测试。
- 提交记录查询。
- 代码提交（可选、人工触发）。

## MCP Tool 适配建议
适合默认开放：
- `pintia_get_login_status`
- `pintia_list_problem_sets`
- `pintia_search_problems`
- `pintia_get_problem`
- `pintia_get_problem_samples`
- `pintia_get_submission_result`
- `pintia_run_local_samples`

谨慎开放（用户显式确认后）：
- `pintia_submit_solution`

不应默认开放：
- 无人值守自动刷题、批量代提交、绕过验证码/登录/限流、抓取考试答案。

## 核心网络请求与数据结构（本项目抽象）
- 会话：`LoginStatus`
- 题集：`ProblemSet[]`
- 搜索结果：`ProblemSearchResult[]`
- 题面：`ProblemDetail`
- 样例：`ProblemSample[]`
- 提交状态：`SubmissionResult`

> 说明：由于本仓库不直接复用插件源代码实现，具体接口路径以本项目 client 封装和后续真实联调结果为准；当前提供清晰类型与可替换 HTTP 抽象，便于后续对接真实端点。
