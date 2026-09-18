---
title: 全人助手开发
englishTitle: Holistic Assistant
category: holistic-assistant
repositoryVisibility: private
visual: campus
technicalTitle: 把学校文件里的规则，写进可以检查的规划。
order: 1
status: 公共预览 · 持续开发
statusDetail: 课程索引、培养方案和规划工具已经上线。AI 功能是否可用，以在线版本当时的运行状态为准。
description: 全人助手是香港中文大学（深圳）学生使用的学业规划系统。它整理培养方案、SIS 课程信息和全校规则，帮助学生查课、排课和检查毕业要求。
summary: 我把培养方案 PDF、SIS 课程信息和先修关系整理到一起，再做成可以修改的四年规划。这里面反复要解决的问题，是怎么保留学校文件里的课程顺序、选修课位和选择组。
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
engineering:
  - title: PDF 和 SIS 怎么对上
    detail: PDF 描述培养方案的结构，SIS 提供每门课的具体信息。我按课程代码和专业方案组织分层 JSON 索引，再为检索和路线图生成准备上下文，避免只拿到零散的课程片段。
  - title: 选修课位不能随便补成一门课
    detail: 路线图解析会区分固定课程、选修课位和多选一课程组。校验逻辑检查学期位置、课程标题和专业方向，前端也保留这些结构，方便学生继续修改。
  - title: 服务启动时不用重新读完所有材料
    detail: Docker 构建时预先生成课程索引，运行时使用缓存；PDF 知识库按需加载，并通过线程锁处理并发访问。健康检查单独返回服务状态，不触发 PDF 解析。
  - title: 把容易出错的情况留在测试里
    detail: 仓库中保留培养方案正确性、课程上下文、接口降级和路线图拖动等测试。已有测试可以帮助检查修改后的行为，实际检索效果还需要用固定问题集继续评估。
stack:
  - Flask
  - Gemini API
  - Playwright
  - Hybrid retrieval
  - Layered JSON indexes
  - Vanilla JavaScript
  - Docker
---

全人助手从一个很简单的问题开始：能不能让模型读懂培养方案 PDF？后来我加入了 SIS 课程索引、全校毕业规则、先修关系图和可编辑路线图。现在学生可以在同一个地方查课程、看要求、调整自己的四年规划。

我会继续在这里更新数据、规则、界面和部署情况。下面的文章保留每个阶段当时的做法；最新数据以页面上的核验日期为准。
