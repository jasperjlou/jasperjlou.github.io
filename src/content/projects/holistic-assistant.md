---
title: 全人助手开发
englishTitle: Holistic Assistant
order: 1
status: 公共预览 · 持续开发
statusDetail: 课程索引、培养方案与规划工具已上线；AI 生成能力以部署环境的实时服务状态为准。
description: 面向香港中文大学（深圳）学生的学业规划与课程咨询系统，把培养方案、SIS 课程信息和全校规则整理成可核验的学习路线。
summary: 项目的核心不是再做一个通用聊天机器人，而是持续维护一套与学校规则、课程结构和学生身份相匹配的可信数据资产，并把它转化为可编辑、可检查的规划体验。
liveUrl: https://holisticassistant.com/
githubUrl: https://github.com/jasperjlou/holistic-assistant
launched: "2025.10"
lastVerified: 2026-08-09
heroImage: /assets/campus/academic-courtyard.webp
heroAlt: 香港中文大学（深圳）学术中庭与连桥
metrics:
  - value: "1,585"
    label: 课程索引
    note: 其中 1,583 条通过当前有效性检查
  - value: "37"
    label: 专业方案
    note: 覆盖当前可识别的本科专业路径
  - value: "732"
    label: 先修关系
    note: 用于路线图顺序与风险检查
  - value: "38"
    label: 官方 PDF
    note: 含培养方案与全校修读规则
features:
  - index: "01"
    title: 聊天规划
    description: 以课程、培养方案和转学分材料为上下文，先说明证据与不确定性，再给出下一步。
  - index: "02"
    title: 规划蓝图
    description: 生成按学期展开的本科路线图，支持拖动课程、填写选修位和重新检查先修风险。
  - index: "03"
    title: 课程资源
    description: 从本地可信资源库定位课程资料，把搜索补链与正式课程结论分开处理。
  - index: "04"
    title: 学业轨迹
    description: 把长期目标、学期节点和每周时间放进同一套规划节奏，而不是只给一次性答案。
  - index: "05"
    title: 身份档案
    description: 根据专业、入学学年与学生身份匹配全校核心、国情教育和培养方案版本。
  - index: "06"
    title: 选课推荐
    description: 围绕课程组合、学期开设规律与学生目标讨论选择，并保留人工确认边界。
principles:
  - 官方来源优先，生成内容不能覆盖培养方案和 Registry 规则
  - 数据快照、推断和用户输入分层呈现
  - 规划可编辑、可审计，也必须允许用户明确确认
stack:
  - Flask
  - Gemini API
  - Playwright
  - Hybrid retrieval
  - Layered JSON indexes
  - Vanilla JavaScript
---

全人助手最初从“让模型读懂培养方案 PDF”开始，后来逐步扩展到 SIS 课程索引、全校毕业规则、先修关系图和可编辑路线图。现在它更接近一个有证据边界的个人规划工作台，而不是单纯的问答演示。

这页会持续记录项目在数据质量、规则建模、交互设计和部署可靠性上的变化。历史文章保留当时的选择与判断；最新能力和数据以这里标注的核验时间为准。
