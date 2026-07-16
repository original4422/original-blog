# Blog Build Series Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 发布一篇个人博客工程复盘和一篇可复现教程，并用这次真实公开内容变更完成 Task 9.4 的双端部署与观察门禁。

**Architecture:** 两篇 MDX 只进入 `packages/content`，图片统一存入共享媒体目录；Vercel 直接使用根路径，Pages 在 MDX 图片渲染边界注入生产 `basePath`。同一 `main` 提交独立触发 Vercel 与 Pages，线上通过 `version.json`、内容路由和媒体请求验证一致性。

**Tech Stack:** MDX、Next.js 16、React 19、pnpm workspace、SVG/PNG、Playwright、GitHub Actions、Vercel、GitHub Pages、Node.js 24。

---

### Task 1: 固化设计与执行边界

**Files:**

- Create: `docs/plans/2026-07-16-blog-build-series-design.md`
- Create: `docs/plans/2026-07-16-blog-build-series.md`

**Step 1: 写入用户确认的双文章设计**

记录两篇文章的读者、论点、结构、图片和验证边界。

**Step 2: 检查计划格式与工作树**

Run: `git diff --check && git status --short`

Expected: 只有两份计划文档，无格式错误。

**Step 3: 提交设计**

```bash
git add docs/plans/2026-07-16-blog-build-series-design.md docs/plans/2026-07-16-blog-build-series.md
git commit -m "docs: plan blog build article series"
```

### Task 2: 制作真实视觉证据

**Files:**

- Create: `packages/content/media/blog/blog-system-architecture.svg`
- Create: `packages/content/media/blog/independent-release-flow.svg`
- Create: `packages/content/media/blog/vercel-home-desktop.png`
- Create: `packages/content/media/blog/pages-mobile-navigation.png`

**Step 1: 从两个生产站点采集截图**

使用 Playwright 分别以 1440×900 和 390×844 访问生产站点；移动截图打开导航菜单。图片写入共享媒体目录。

**Step 2: 创建两张信息图**

架构图显示 `packages/content`、两个应用和两个部署目标；发布图显示同一 `main` 提交、两条独立部署链、`version.json` 和十五分钟收敛目标。

**Step 3: 检查图片**

Run: `file packages/content/media/blog/* && du -h packages/content/media/blog/*`

Expected: SVG 可解析，PNG 尺寸符合视口且文件体积适合网页。

### Task 3: 写两篇规范内容

**Files:**

- Create: `packages/content/posts/from-two-blogs-to-one-system.mdx`
- Create: `packages/content/posts/vercel-pages-monorepo-guide.mdx`

**Step 1: 写工程复盘**

使用第一人称、短段落和明确判断，包含真实决策、问题与未完成边界。

**Step 2: 写可复现教程**

提供目录、配置、命令、验证方法和常见失败模式；避免复制整个仓库。

**Step 3: 验证内容契约**

Run: `source ~/.nvm/nvm.sh && nvm use 24 && pnpm audit:content`

Expected: 两篇文章、全部图片、slug、日期和标签通过单一内容源审计。

### Task 4: 让 Pages MDX 图片感知 basePath

**Files:**

- Modify: `apps/pages/app/blog/[slug]/page.tsx`

**Step 1: 证明生产路径问题**

构建前确认 Pages 当前只为 `h2`、`h3` 提供 MDX 组件，根路径图片不会自动增加 `/original-blog`。

**Step 2: 添加最小图片适配器**

为 MDX `img` 组件保留 alt 与其余属性；字符串 `src` 通过 `withBasePath` 转换，并使用文章图片样式。

**Step 3: 运行类型与格式检查**

Run: `source ~/.nvm/nvm.sh && nvm use 24 && pnpm check && pnpm typecheck`

Expected: 两套应用全部通过。

### Task 5: 完成本地生产验收

**Files:** No additional files unless verification exposes a defect.

**Step 1: 清理增量类型缓存**

Run: `rm -f apps/pages/tsconfig.tsbuildinfo apps/vercel/tsconfig.tsbuildinfo`

**Step 2: 运行完整 Node 24 门禁**

```bash
source ~/.nvm/nvm.sh
nvm use 24
pnpm audit:content
pnpm check
pnpm typecheck
pnpm build
pnpm --filter @original/blog-pages audit:static
pnpm audit:versions
pnpm test:e2e
```

Expected: 两版构建包含六篇文章，新图片无缺失，所有检查退出 0。

**Step 3: 本地浏览两篇文章**

使用 Pages 生产路径预览和 Vercel 本地构建检查文章目录、图片比例、移动宽度与控制台错误。

### Task 6: 提交、发布并验证双端

**Files:**

- Modify: `docs/acceptance.md`
- Create: `docs/migration/content-release-observation-2026-07-16.md`

**Step 1: 提交内容更新**

```bash
git add packages/content apps/pages docs/acceptance.md docs/migration/content-release-observation-2026-07-16.md
git commit -m "content: publish blog build article series"
git push origin main
```

**Step 2: 监控自动部署**

Expected: CI、Pages 和 freshness workflow 成功；Vercel 与 Pages 的 `/version.json` 在十五分钟内指向同一提交。

**Step 3: 验证生产内容**

检查两篇文章、四张图片、Feed、Sitemap、搜索索引、桌面与移动页面；未知媒体路径保持 404。

**Step 4: 开始观察窗**

记录双端发布时间、提交、workflow 与首轮路由结果。旧 Pages 仓库保持 `archived=false`。

### Task 7: 24 小时后关闭 Task 9.4

**Files:**

- Modify: `docs/migration/content-release-observation-2026-07-16.md`
- Modify: `docs/acceptance.md`
- Modify: `README.md`
- Modify: `docs/deployment-runbook.md`

**Step 1: 复查观察结果**

确认两个生产站点仍为同一已发布版本，两篇文章及媒体均正常，自动化没有失败。

**Step 2: 归档旧 Pages 仓库**

将 `original4422/original-blog-pages` 设为 archived；不删除仓库、tags、Actions 或历史。

**Step 3: 固化最终证据**

更新验收清单、README、runbook 和观察记录，提交并推送；再次确认主站和新 Pages 不受旧仓库归档影响。
