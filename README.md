# SEO Pipeline Desktop（本地 SEO 内容工程工具）

> ⚠️ **本压缩包是源代码工程，里面没有 .exe。** `.exe` 安装包需要在一台联网、装有 Node.js 的电脑上「构建」生成（构建时要下载约 150MB 的 Electron 运行时）。下面给你两种拿到 .exe 的方法，**任选其一**。

## 🅰️ 方法一：在自己的 Windows 电脑上构建（最直接）

1. 安装 **Node.js**（只需装一次）：打开 https://nodejs.org → 下载 **LTS** 版 → 一路「下一步」装完。
2. 把本压缩包解压到一个文件夹（如 `D:\seo-pipeline`）。
3. **双击文件夹里的 `一键打包.bat`**，保持联网，等它跑完（首次 3-10 分钟）。
4. 结束后会自动打开 `release` 文件夹，里面的 **`SEO Pipeline Setup 2.0.0.exe`** 就是成品，双击安装即可。

> 不想用脚本？在该文件夹打开命令行（地址栏输入 `cmd` 回车），依次运行：
> ```
> npm install
> npm run build:app
> ```
> 完成后 `release\SEO Pipeline Setup 2.0.0.exe` 即为安装包。

## 🅱️ 方法二：用 GitHub 云端自动构建（自己电脑不用装任何东西）

1. 在 https://github.com 注册并新建一个仓库（可设为 Private）。
2. 把本工程全部文件上传到该仓库（网页端可直接拖拽上传 zip 解压后的内容）。
3. 进入仓库的 **Actions** 标签页 → 左侧选 **Build Windows EXE** → 右侧点 **Run workflow**。
4. 等 5-10 分钟变绿勾后点进去，在页面底部 **Artifacts** 处下载 **SEO-Pipeline-Windows-安装包**，解压即得 `.exe`。

（构建配置已内置于 `.github/workflows/build-windows.yml`，无需改动。）

---


Windows 优先的**本地桌面工具**：导入 CSV/Excel 数据 → 规则引擎完成 10 阶段 SEO 内容流水线 → 导出 Markdown/HTML 报告。
**核心流程不依赖 AI**；AI（OpenAI-compatible）与实时搜索（Serper/Tavily）均为可插拔增强。

---

## 一、最终用户：安装即用（无需 Node / Python）

1. 拿到安装包 `release/SEO Pipeline Setup x.x.x.exe`，双击安装（可自选目录）。
2. 启动后即处于**无 AI 模式**，全部规则功能可用：
   - 「项目输入」填目标关键词（必填）和站点/市场/转化目标；
   - 「数据导入」上传关键词表 / GSC 导出 / 竞品 URL 表 / 产品资料表（CSV/TSV/Excel，自动猜测字段映射，可手动修改；自动处理 GBK 乱码、空行、重复关键词）；
   - 点 **「规则全流程」**：关键词意图分层与聚类 → SERP 竞品框架 → 站内参考 → 策略简报 → BLUF 大纲 → 结构稿 → 质量门禁评分 → 发布交接包 → 监控计划；
   - 侧边栏导出 **Markdown / HTML 报告**（含结论、关键词/页面/意图映射、策略、执行清单、风险与待补充）。
3. 可选增强（「设置」页，全部密钥**只保存在本机**，不进报告、不进安装包）：
   - **AI 增强**：填 OpenAI-compatible 的 Base URL / 模型 / API Key → 解锁「AI 全流程」与逐阶段「AI 增强」（完整英文草稿、严格编辑门禁）。失败自动重试 2 次并给出中文错误。
   - **搜索增强**：选 Serper 或 Tavily 并填 Key → 阶段 1-3 注入实时 SERP 证据。未配置时工具照常运行，报告中明确标注「缺少实时 SERP 证据」。

数据存储：本地 SQLite（`%APPDATA%/seo-pipeline/seo-data.sqlite`，由 sql.js 驱动，零原生依赖；异常时自动降级 JSON 存储，功能不变）。

> 内容契约：分析说明为简体中文；可直接上站的 SEO 字段（SEO Title / Meta / URL slug / H1 / H2 / ALT / 锚文本）为英文。未证实数据标 `[VERIFY_NEEDED]`，经验类占位标 `[NEEDS_REAL_EXPERIENCE]`。无 AI 模式不生成完整文章草稿（输出结构稿），保证不编造内容。

## 二、开发者：构建安装包（仅打包机需要 Node ≥18）

```bash
npm install
npm run dev:app      # 开发调试（Vite + Electron 热更新）
npm run build:app    # 产出 Windows NSIS 安装包到 release/
npm run lint         # 已忽略 dist/ 与 release/
```

首版仅 Windows、不做自动更新（升级=重发安装包）。`npm run pack:dir` 可出免安装目录用于快速验证。

### 纯浏览器开发模式（可选）
```bash
cp .env.example .env   # 填 OPENAI_API_KEY（仅代理进程持有）
npm run server         # 本地代理 :8787（/health 可检查）
npm run dev            # 浏览器版：localStorage 存储 + CSV 导入 + 规则引擎全可用
```

## 三、命令行批量（Node CLI，替代旧 Python 脚本）

```bash
# 规则模式：零 Key、零网络即可出报告
node cli/batch.js --keywords samples/keywords-sample.csv \
  --competitors samples/competitors-sample.csv --products samples/products-sample.csv \
  --keyword "best massage gun for back pain" --site https://example-store.com \
  --conversion 加购 --out reports --html

# AI / 搜索增强（环境变量）
OPENAI_API_KEY=sk-xxx node cli/batch.js ... --ai
SERPER_API_KEY=xxx    node cli/batch.js ... --search
```

## 四、目录结构

```
electron/        主进程：窗口、IPC、SQLite(db.js)、设置(settings.js)、导入(importer.js)、
                 导出(export.js)、providers/(ai.js / search.js)、preload.cjs
shared/          纯 JS 共享层（渲染端 / 主进程 / CLI 复用）
  engine/        规则 SEO Engine：意图分类、聚类、优先级评分、9 个阶段生成器、质量门禁
  importer-core.js  CSV 解析 / 表头识别 / 字段映射 / 行标准化
  report.js      Markdown/HTML 报告组装
  prompts.js     AI 模式提示词（自动注入导入数据摘要 + 搜索证据）
src/             React 渲染端（经 window.desktop IPC 访问本地服务；浏览器降级 shim）
cli/batch.js     批量命令行
samples/         示例 CSV（中文表头，演示字段映射）
server/index.js  浏览器开发模式专用代理（桌面版不需要）
```

## 五、测试计划对照

| 测试项 | 实现 |
|---|---|
| 裸机安装可启动 | NSIS 安装包自带 Electron 运行时；SQLite 用 sql.js(WASM) 零原生编译 |
| 无 AI key 完成分层/映射/策略/大纲/导出 | 规则引擎 `shared/engine/`，「规则全流程」按钮 |
| AI 单阶段/全流程/失败重试/报错 | `electron/providers/ai.js`：429/5xx/网络重试 2 次，401/404 中文提示；失败只影响当前阶段 |
| 缺搜索 API 继续运行并标注 | `providers/search.js` 返回空结果+note；规则输出统一标注「缺少实时 SERP 证据」 |
| CSV/Excel：缺字段/乱码/空行/重复/大文件 | 必填字段校验、GBK 自动降级、空行跳过、引擎层按关键词去重、流式逐行入库 |
| 导出中文正常、英文 SEO 字段保留 | UTF-8 写盘；HTML 自带中文字体栈样式 |
