# AGENTS.md — 项目速览（供后续维护者 / AI 协作者）

## 这是什么
本地优先的 SEO 内容工程桌面工具（Electron + React + sql.js SQLite）。
10 阶段流水线每个阶段支持 `rule`（默认，离线可用）/ `ai`（可选增强）两种运行模式，
阶段 1-3 可叠加搜索增强（`rule+search` / `ai+search`）。

## 架构分层（修改前先认清边界）

| 层 | 位置 | 约束 |
|---|---|---|
| 共享纯逻辑 | `shared/` | **禁止**引入 Node/浏览器专属 API；被渲染端、主进程、CLI 三方 import |
| 主进程 | `electron/` | 唯一能碰 fs / dialog / 密钥 / 外网密钥请求的地方；ESM（preload 是 CJS） |
| 渲染端 | `src/` | 只通过 `window.desktop`（preload 暴露）访问本地服务；`src/lib/desktop.js` 含浏览器 shim |
| CLI | `cli/batch.js` | 复用 shared，providers 用环境变量内联实现 |

## 关键模块
- `shared/engine/cluster.js#buildContext`：所有规则阶段的统一分析上下文（聚类/意图/评分/问题词/长尾）。
- `shared/engine/index.js#runStageRule(stageId, ctx, outs)`：阶段调度入口。
- `shared/engine/stages.js`：阶段 1-6、8、9 生成器；`quality.js`：阶段 7 启发式门禁。
- `shared/prompts.js#makePrompt(id, inp, outs, digest, serpDigest)`：AI 模式提示词；digest 来自 `buildDigest/buildSerpDigest`，保证 AI 输出锚定导入数据与搜索证据。
- `electron/db.js`：sql.js SQLite（内存库+防抖落盘 `userData/seo-data.sqlite`），加载失败自动降级 JSON 同接口存储 —— 离线/无 node_modules 环境也能跑通逻辑测试。
- `electron/settings.js`：密钥唯一存放点（`userData/settings.json`）；`settings:get` 只回传掩码视图。
- `electron/importer.js`：dialog 选文件 → `parseFile`（CSV 自实现 / TSV / XLSX 动态 import）→ GBK 降级 → 两步导入（预览映射 → commit）。
- `shared/report.js`：报告组装（结论/映射表/各阶段/执行清单/风险与待补充，自动聚合 [VERIFY_NEEDED] 与缺数据警告）+ 自实现 markdownToHtml。

## 内容契约（不得破坏）
中文分析 + 英文 SEO 字段（Title/Meta/slug/H1/H2/ALT/锚文本）；
未证实数据 `[VERIFY_NEEDED]`；经验占位 `[NEEDS_REAL_EXPERIENCE]`；
无 AI 模式阶段 6 只产「结构稿」并显式声明，阶段 7 对结构稿强制 NO_GO。

## 常用命令
`npm run dev:app`（开发）、`npm run build:app`（NSIS 安装包 → release/）、
`npm run lint`（忽略 dist/release）、`node cli/batch.js --help`（批量）。

## 已知取舍
- SQLite 选 sql.js（WASM）而非 better-sqlite3：放弃极致性能，换取裸机零编译、打包零原生依赖；数据量（万级关键词）下无感。
- 首版无自动更新、仅 Windows target（package.json `build.win`）。
- 旧 Python 批量脚本已被 `cli/batch.js` 取代（目标机器无 Python）。
