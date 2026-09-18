---
title: AI 同步助手
englishTitle: AI Sync and Scheduled Tasks
category: ai-tools
repositoryVisibility: private
visual: pipeline
order: 3
status: 自用工具 · 源码私有
statusDetail: 项目管理可迁移的规则、技能、整理后的记忆和插件清单。仓库包含个人工作资料，当前公开展示设计方法。
description: AI Sync 是我做的跨设备开发工具，用来保存 AI 工作环境里的规则、技能和整理后的记忆，方便换电脑后继续使用。
summary: 换电脑后，之前整理好的规则和技能还得重新配置。我用 GitHub 保存可迁移的部分，在导出和恢复时检查文件差异，同时把不同 AI 客户端的数据分开管理。
githubUrl: https://github.com/jasperjlou/ai-sync-and-scheduled-tasks
launched: 持续维护
lastVerified: 2026-09-18
technicalTitle: 换一台电脑，也能接着用自己的工作环境。
metrics: []
pipeline:
  - title: 选择可迁移文件
    detail: 规则 · 技能 · 整理后的记忆 · 插件清单
  - title: 导出并校验
    detail: 白名单 · 路径转换 · SHA-256 文件清单
  - title: 云端版本管理
    detail: GitHub · Actions 审计 · 确定性内容索引
  - title: 预览恢复差异
    detail: 哈希比较 · 冲突跳过 · 确认后写入
features:
  - index: "01"
    title: 按客户端分开保存
    description: Codex、Antigravity 和通用资料分别存放。只有不依赖某个客户端、可以重复使用的内容才进入共享目录。
  - index: "02"
    title: 文件内容能核对
    description: 为文件生成 SHA-256 清单，并对文本换行和 BOM 做规范化比较，减少 Windows 与 Linux 之间只有格式不同的误报。
  - index: "03"
    title: 恢复前先看差异
    description: 默认先展示恢复计划。本地文件已有不同内容时，工具标记冲突并跳过；清单和索引通过临时文件替换方式写入。
  - index: "04"
    title: 定时任务各做各的事
    description: 设备负责本地导出和恢复，GitHub Actions 负责检查已提交内容和整理索引。任务按需或定时执行，不常驻监听文件变化。
engineering:
  - title: 什么可以跟着设备走
    detail: 同步范围采用白名单。规则和整理后的知识可以迁移，账号凭据、浏览器会话、聊天数据库和缓存不进入快照；插件只记录名称与版本，新设备重新安装和登录。
  - title: 相同内容怎样得到相同结果
    detail: 内容索引按相对路径稳定排序，对文本换行做规范化，再计算哈希。测试覆盖换行、BOM 和目录遍历顺序，检查 Windows 与 Linux 生成结果是否一致。
  - title: 恢复过程中怎么处理不同版本
    detail: 恢复预览比较目标文件与仓库内容，已经一致的文件不重复处理，有冲突的文件会跳过。空的源目录也有保护检查，避免误删已有资料。
  - title: 云端任务能做什么
    detail: GitHub Actions 只能检查和整理已经提交的资料；关机设备上的新文件仍需要设备下次运行时导出。不同任务使用各自的并发组，索引整理任务限制可写文件范围。
principles:
  - 仓库保持私有，公开页面只介绍设计与实现
  - 本地文件冲突会明确显示，恢复时不默认覆盖
  - 设备重新安装插件并登录，凭据和会话不随快照迁移
stack:
  - Python
  - Git
  - SHA-256
  - GitHub Actions
  - unittest
evidence: []
---

我在不同设备上使用 AI 开发工具时，想保留的不只有代码。自己写的规则、常用技能和已经整理过的项目知识，也会影响下一次工作能不能接得上。

所以我把这些内容里可以迁移的部分单独整理出来，用 GitHub 管理版本，再写导出、审计和恢复工具。这里反复要处理的是文件范围、跨系统路径和本地冲突。

这个项目包含个人工作资料，所以仓库保持私有。页面里展示同步流程和工程取舍，GitHub 入口指向我的主页。
