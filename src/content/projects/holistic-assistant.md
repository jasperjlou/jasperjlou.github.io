---
title: 全人助手开发
englishTitle: Holistic Assistant
order: 1
status: 公共预览 · 持续开发
statusDetail: 课程索引、培养方案和规划工具已经上线。AI 功能是否可用，以在线版本当时的运行状态为准。
description: 全人助手是香港中文大学（深圳）学生使用的学业规划系统。它整理培养方案、SIS 课程信息和全校规则，帮助学生查课、排课和检查毕业要求。
summary: 项目的核心是持续整理学校规则、课程结构和学生信息，再把这些数据做成可以编辑、可以检查的可视化规划。
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
    description: 聊天时会同时查看课程、培养方案和转学分材料。资料不够时会说明还缺什么，不替学校规则补答案。
  - index: "02"
    title: 规划蓝图
    description: 把四年的课程排到各个学期。课程可以拖动，选修位可以修改，调整后再检查先修关系。
  - index: "03"
    title: 课程资源
    description: 在本地资料库里找课程材料。搜索结果用来补充线索，正式结论仍回到课程和学校文件。
  - index: "04"
    title: 学业轨迹
    description: 把长期目标、每学期的课程和每周时间放到同一页，方便随时调整。
  - index: "05"
    title: 身份档案
    description: 按专业、入学年份和学生身份匹配培养方案与全校要求。
  - index: "06"
    title: 选课推荐
    description: 查看课程组合、开课规律和个人目标，给出选课建议；建议发出后仍由学生确认。
principles:
  - 先看学校文件，再看模型生成的内容
  - 数据、推断和学生自己填写的信息分开显示
  - 每份规划都能修改，也会保留检查结果
stack:
  - Flask
  - Gemini API
  - Playwright
  - Hybrid retrieval
  - Layered JSON indexes
  - Vanilla JavaScript
---

全人助手从一个很简单的问题开始：能不能让模型读懂培养方案 PDF？后来我加入了 SIS 课程索引、全校毕业规则、先修关系图和可编辑路线图。现在学生可以在同一个地方查课程、看要求、调整自己的四年规划。

我会继续在这里更新数据、规则、界面和部署情况。下面的文章保留每个阶段当时的做法；最新数据以页面上的核验日期为准。
