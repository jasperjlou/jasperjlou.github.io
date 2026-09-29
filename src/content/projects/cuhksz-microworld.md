---
title: CUHKSZ MicroWorld
englishTitle: Campus Agent World & Evaluation Environment
category: agent-world
repositoryVisibility: public
visual: pipeline
order: 1
status: Public source · V1.0 Phase E · Active
statusDetail: 当前版本已经包含神仙湖空间切片、连续连接段、第一岔路、世界时间、校园活动、接驳车原型、结构化 Agent 接口、轨迹日志与独立任务验证。支路与部分空间关系仍包含推断或占位，不声称是测绘级数字孪生。
description: 一个以港中深校园为背景的 3D Agent 环境，把语义导航、时间约束、交通选择、错误路线恢复、轨迹记录与任务验证放进同一个可运行世界。
summary: 这个项目不是只做一个“港中深 GTA”。我更关心的是：当 Agent 被放进一个持续存在的 3D 校园世界，它能不能读懂地点与时间，在步行、等车、岔路和支线任务之间做决策，并留下可复现实验轨迹。
githubUrl: https://github.com/jasperjlou/CUHKSZ-MicroWorld
launched: "2026 · ongoing"
lastVerified: 2026-09-29
metrics:
  - value: "1.0.0-phase-e"
    label: current world version
    note: Current project.godot version at the 2026-09-29 source audit.
  - value: "4.5.1"
    label: Godot version
    note: Current project engine target.
  - value: "AStar3D"
    label: semantic navigation
    note: High-level waypoint graph; physical movement still uses CharacterBody3D and GodotPhysics3D.
  - value: "3"
    label: reconstruction confidence levels
    note: verified · inferred · placeholder.
pipeline:
  - title: 结构化观察
    detail: 地点 · 地标 · 时间 · 活动 · 交通状态 · 可用动作
  - title: Agent 决策
    detail: 选择动作与目标，不直接获得隐藏的正确路线
  - title: 语义导航与物理执行
    detail: AStar3D 路点图 · CharacterBody3D · GodotPhysics3D
  - title: 持续校园世界
    detail: 神仙湖 · 岔路 · 时间 · 活动 · 接驳车 · NPC 交互
  - title: 可复现实验输出
    detail: 事件日志 · trajectory · 独立 Task Verifier · Benchmark 管线
features:
  - index: "01"
    title: 可游玩的校园空间
    description: 当前包含神仙湖、湖口连接段与第一岔路，以及上园、下园、道扬书院等方向支路。世界强调可辨认与连续可行走，而不是伪装成实测 GIS/BIM 数据。
  - index: "02"
    title: 时间与活动约束
    description: 世界有统一时钟、校园活动和 early/on-time/late/missed 状态，任务结果会随着 Agent 的路线、等待和互动时间发生变化。
  - index: "03"
    title: 交通选择与重新规划
    description: Agent 可以步行、等待、上车、放弃等待并继续走；接驳班次与车程目前是原型设定，用来研究决策而不是复刻真实时刻表。
  - index: "04"
    title: 结构化 Agent 接口
    description: Agent 读取公开观察与合法动作，再由现有角色控制、碰撞与世界系统执行；环境不会直接返回“正确分支”给 Agent。
  - index: "05"
    title: 轨迹与独立验证
    description: 动作、世界事件和任务结果可以被记录，Task Verifier 与 Agent 决策逻辑分离，为后续模型比较提供可重复的实验接口。
  - index: "06"
    title: 证据感知的空间重建
    description: 空间资料被标为 verified、inferred 或 placeholder。资料不足不会永久阻塞建设，但推断必须记录依据与可替换性。
engineering:
  - title: 游戏世界和 Agent 环境共用同一套物理执行
    detail: 高层路径由 AStar3D 语义路点图提供，真正移动仍通过 CharacterBody3D、move_and_slide() 与 GodotPhysics3D 完成，避免 Agent 只在抽象图上“瞬移”。
  - title: 不把资料缺口伪装成真实测绘
    detail: 项目允许根据照片、地图、道路逻辑和旧资料建立最合理的连续世界，但推断坐标、尺寸、坡度和朝向不会被写成真实米制测量。
  - title: Benchmark 与世界逻辑分层
    detail: Provider、Agent、环境、日志和验证器彼此分开。Mock provider 只用于验证评测管线，当前仓库不把模拟结果宣传成真实 LLM 成绩。
  - title: 旧资产只做审计，不批量导入
    detail: 约 14.2 GB 的旧 Virtual Campus/GTA 资料目前只保留 inventory、hash、候选项和复用判断；没有因为“旧模型存在”就直接当作当前真实校园几何。
principles:
  - 这是 Agent environment，不是测绘级数字孪生。
  - verified、inferred 与 placeholder 必须明确区分。
  - Agent 只能使用公开观察，不直接读取隐藏的正确路线或评测答案。
  - 模拟 provider 与自动 QA 不能冒充真实模型实验或独立真人实验。
stack:
  - Godot 4.5.1
  - GDScript
  - GodotPhysics3D
  - AStar3D
  - CharacterBody3D
  - JSON task definitions
  - Reproducible QA
evidence:
  - label: GitHub repository
    url: https://github.com/jasperjlou/CUHKSZ-MicroWorld
  - label: Benchmark protocol
    url: https://github.com/jasperjlou/CUHKSZ-MicroWorld/blob/main/BENCHMARK.md
  - label: Phase E world definition
    url: https://github.com/jasperjlou/CUHKSZ-MicroWorld/blob/main/docs/PHASE_E_JUNCTION_WORLD.md
---

我最开始可以把它理解成“做一个港中深 GTA”，但项目真正有意思的部分逐渐变成了 Agent 环境：世界里有真实碰撞、语义地点、时间、活动、交通和岔路；Agent 必须在这些约束下完成任务，而不是只在文本里回答一个规划问题。

当前 Phase E 仍然只是完整校园世界的早期阶段。地图中的部分连接和支路来自证据支持下的推断，后续可以随着更好的实景资料被替换。相比把不确定性藏起来，我更希望把“已经验证的世界”和“为了实验连续性建立的可替换世界”同时保留下来。
