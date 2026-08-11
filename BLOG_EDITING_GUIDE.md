# 博客编辑指南

这份指南只管日常编辑。文章还是 Markdown，项目资料也集中在一个文件里。少量文字可以在 GitHub 网页上改；涉及排版和样式时，建议在本地预览以后再提交。

## 先认清几个位置

| 想改什么 | 文件或目录 |
| --- | --- |
| 首页文字 | `src/pages/index.astro` |
| 项目列表页 | `src/pages/projects/index.astro` |
| 全人助手项目页内容 | `src/content/projects/holistic-assistant.md` |
| 文章列表页 | `src/pages/notes/index.astro` |
| 关于页 | `src/pages/about/index.astro` |
| 页头和页脚 | `src/components/SiteHeader.astro`、`src/components/SiteFooter.astro` |
| 全站颜色、字号和版式 | `src/styles/global.css` |
| 博客标题、邮箱和链接 | `src/data/site.ts` |
| 网页图标 | `static/favicon.svg` |
| 所有文章 | `source/_posts/` |

不要手改 `dist/`、`.astro/` 和 `node_modules/`。检查或上线过程中会重新生成这些内容。`static/CNAME` 保存自定义域名，也不要删除。

## 修改现有文字

打开对应文件，修改标签中间的文字：

```astro
<h1>项目正在这里发生。</h1>
<p>这里写新的介绍。</p>
```

`<br />` 表示在这里换行。链接的地址写在 `href` 里：

```astro
<a href="/projects/">查看项目</a>
```

改中文时不要碰 `<h1>`、`<p>`、`</p>` 这些标签。标签缺一半，页面就可能无法构建。

## 写一篇新文章

在 `source/_posts/` 新建一个 `.md` 文件，可以从下面这份开始：

```markdown
---
title: 文章标题
date: 2026-08-10 20:00:00
slug: english-url-name
description: 一两句话说明这篇文章写了什么。
tags:
  - 全人助手
  - 开发记录
categories:
  - 项目开发
project: holistic-assistant
stage: 05 · 阶段名称
order: 5
---

这里开始写正文。

## 第一个小标题

正文可以继续写。空一行以后再起下一段。
```

`title`、`date`、`slug` 和 `description` 必须填写。全人助手文章再加上 `project`、`stage` 和 `order`，它就会自动出现在项目时间线上。

文章一旦发布，尽量别再改 `date` 和 `slug`。这两个字段一起决定文章网址，改动以后旧链接会失效。

Markdown 常用写法：

```markdown
## 二级标题
### 三级标题

**粗体**

- 列表第一项
- 列表第二项

[链接文字](https://example.com/)

![图片说明](/assets/图片文件.webp)
```

图片放在 `static/assets/` 下面。文章里从 `/assets/` 开始写地址。

## 更新全人助手项目页

打开 `src/content/projects/holistic-assistant.md`。文件上半部分是项目资料，下半部分是页面上的两段介绍。

- `status`：页面上显示的项目状态。
- `statusDetail`：功能区域右侧的简短说明。
- `description`：首页和项目页都会用到。
- `summary`：项目列表页的介绍。
- `lastVerified`：数据最近一次核验的日期，格式写成 `2026-08-10`。
- `metrics`：课程数、专业方案数等数字。
- `features`：六个功能入口。
- `principles`：使用前需要说明的规则。
- `stack`：当前技术栈。

改数字时，记得同时更新 `lastVerified` 和对应的 `note`。历史文章写的是当时的状态，不需要跟着新数字一起改。

## 调整颜色、字号和排版

全站样式在 `src/styles/global.css`。

- 文件开头的 `:root` 保存颜色、字体和页面宽度。
- `.home-hero` 是首页第一屏。
- `.page-hero` 是项目、文章、关于等内页的标题区。
- `.project-` 开头的样式控制项目页。
- `.article-` 和 `.prose` 控制文章页。
- `.site-footer` 控制页脚。
- `@media (max-width: 980px)` 和 `@media (max-width: 720px)` 控制平板、手机排版。

颜色使用十六进制写法，例如：

```css
:root {
  --ink: #24211d;
  --paper: #f2eee4;
  --accent: #9b4a3d;
}
```

如果把桌面版的两栏改成一栏，也要往下检查两个 `@media` 区域，确认手机上的规则没有冲突。

## 按现在的语气继续写

这版博客的文字以你现有文章和最近的亲自改写为准：

- 从自己正在做的事开头，可以写“我在整理”“我想知道”“我做错了什么”。
- 多写具体动作和对象，例如查课、排课、读培养方案、改四年规划。
- 可以写犹豫、失败和没想清楚的地方，不必把每段都包装成成果。
- 技术名词可以保留，但别连续堆很多抽象词。
- 少用成对转折、空泛强调和宣传稿常见说法。
- 一句话太长时就分成两句。先写发生了什么，再写你的判断。

写完后问自己三件事：这句话是谁在做？做了什么？读者能不能看到一个具体结果？如果三个问题里有两个答不上来，就再改一遍。

## 在本地预览

项目要求使用 WSL 里的 Node 24。打开 PowerShell，运行：

```powershell
wsl bash -lc "source /home/lrjerry/.nvm/nvm.sh && cd /mnt/a/my-tech-blog && npm ci && npm run dev -- --host 0.0.0.0"
```

终端会显示本地地址。把它复制到浏览器里打开。开发服务器会自动刷新，大多数文字和样式修改保存后就能看到。

正式提交前再运行完整检查：

```powershell
wsl bash -lc "source /home/lrjerry/.nvm/nvm.sh && cd /mnt/a/my-tech-blog && npm run validate"
```

看到检查和构建都成功，再继续发布。

## 发布到博客

日常内容放在 `source` 分支。先同步远端，再建立一个编辑分支：

```powershell
cd A:\my-tech-blog
git switch source
git pull --ff-only
git switch -c edit/short-name
git add 要提交的文件
git commit -m "Update blog copy"
git push -u origin edit/short-name
```

到 GitHub 新建 Pull Request，目标分支选 `source`。检查通过后合并。合并会触发 GitHub Pages 部署，通常几分钟后就能在 `https://jasperjlou.me/` 看到更新。

只改一个错字时，也可以在 GitHub 网页打开文件，点铅笔图标编辑并提交到新分支。涉及样式、图片或多个页面时，还是先在本地预览。

## 发布前再看一遍

- 首页、项目页、文章页和关于页都能打开。
- 桌面和手机宽度下没有文字溢出。
- 新文章的标题、日期、描述和网址都正确。
- 全人助手的新数字有来源，也更新了核验日期。
- 页面里没有邮箱以外的私人信息，也没有密钥、令牌和 `.env` 文件。
- `npm run validate` 已经通过。
