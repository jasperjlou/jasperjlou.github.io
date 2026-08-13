# TinaCMS 博客可视化编辑指南

现在日常改文字不需要先找 Astro 文件。TinaCMS 会在浏览器左边显示你的网页，右边显示可以修改的字段；首页文字可以直接在预览里点选。

## 打开编辑器

在 `A:\my-tech-blog` 双击 `START_BLOG_EDITOR.cmd`。等几秒后，浏览器会打开：

```text
http://localhost:4321/admin/index.html#/~/
```

编辑期间不要关闭名为 `TinaCMS server` 的终端窗口。第一次在新电脑上使用时，先在 PowerShell 运行：

```powershell
wsl bash -lc "source /home/lrjerry/.nvm/nvm.sh && cd /mnt/a/my-tech-blog && npm install"
```

## 在界面里改什么

### 首页

进入“首页”，左边会显示真实页面。点击标题、介绍或区块文字，右侧会自动定位到对应字段。

- “首页开场”控制主标题、中文介绍、英文介绍和右侧三行信息。
- “推荐项目”控制首页项目区标题和介绍。
- “最近文章”控制文章区标题、介绍和按钮文字。
- “首页区块”可以拖动排序，也可以暂时移除某个区块。

首页内容实际保存在 `src/content/home/home.json`，通常不需要手改这个文件。

### 全人助手开发

进入“项目”并打开“全人助手开发”。右侧表单可以修改：

- 当前状态、项目介绍和核验日期；
- 课程数、专业方案数等项目数字；
- 六个功能、使用原则和技术栈；
- 项目页正文和主图。

保存后会更新 `src/content/projects/holistic-assistant.md`。

### 文章

进入“文章”可以新建或修改 Markdown 文章。标题、日期、摘要、标签和正文都在同一界面。

全人助手文章要填写：

- `所属项目`：`holistic-assistant`
- `项目阶段`：例如 `05 · 阶段名称`
- `项目内顺序`：例如 `5`

发布日期和网址名称共同决定文章网址。文章发布后尽量不要再改这两项，否则旧链接会失效。

## 保存、预览和撤销

在本地编辑器里点“保存”，TinaCMS 会直接改仓库里的 Markdown 或 JSON 文件，但不会自动提交到 GitHub。网页预览会即时更新。

如果改错了但还没有提交，可以关掉编辑器后在项目目录查看变更：

```powershell
cd A:\my-tech-blog
git diff
```

不要手改 `dist/`、`.astro/`、`node_modules/` 或 `tina/__generated__/`。这些都是自动生成内容。`static/CNAME` 保存博客域名，也不要删除。

## 发布你改好的版本

编辑完成后先检查：

```powershell
wsl bash -lc "source /home/lrjerry/.nvm/nvm.sh && cd /mnt/a/my-tech-blog && npm run validate"
```

再提交和推送：

```powershell
cd A:\my-tech-blog
git status
git add src/content source/_posts static
git commit -m "Update blog content"
git push origin source
```

如果还改了 Tina 配置、样式或页面代码，把对应文件也加入 `git add`。推送到 `source` 后，GitHub Actions 会自动构建并发布博客；可以在仓库的 Actions 页面查看进度。

## 在线编辑还差的一次性设置

本地可视化编辑不需要账号。若要在任何电脑上直接打开线上 `/admin/` 保存到 GitHub，需要：

1. 在 TinaCloud 创建项目并连接 `jasperjlou/jasperjlou.github.io`。
2. 项目分支选择 `source`。
3. 把 TinaCloud 的 Client ID 和 Content Token 分别保存为 GitHub Actions Secrets：`PUBLIC_TINA_CLIENT_ID`、`TINA_TOKEN`。
4. 将网站部署到支持 Astro 实时接口的平台，才能在线使用“点网页文字直接改”；GitHub Pages 只能提供静态后台表单。

不要把 Client ID 之外的令牌写入 `.env.example`、Markdown、聊天记录或 Git 提交。

## 文字与复杂排版的边界

TinaCMS 适合改文字、图片、列表、项目数字和首页区块顺序。全站颜色、字体、断点和精细布局仍在 `src/styles/global.css`；这类修改先在本地预览，再一起提交。
