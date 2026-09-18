---
title: 金融助手
englishTitle: Market Watchdog
category: ai-tools
repositoryVisibility: public
visual: pipeline
order: 2
status: 公开源码 · 持续开发
statusDetail: 公开版本包含行情处理、证据分级、预警去重和测试。行情接入需要自行配置；对外通知默认关闭，AI 复核是可选环节。
description: Market Watchdog 是我做的只读金融信息助手，用来整理美股行情、新闻和公告，再按证据生成预警与报告。
summary: 我想把价格变化和相关新闻放在一起看，也想减少重复提醒。于是我把行情采集、特征计算、新闻证据和预警分级拆开，让每次提醒都能说明依据。
githubUrl: https://github.com/jasperjlou/market-watchdog
launched: 持续开发 · 2026.09 公开源码
lastVerified: 2026-09-18
technicalTitle: 从一条行情，到一条有依据的提醒。
metrics: []
pipeline:
  - title: 行情与新闻
    detail: Moomoo OpenD / yfinance · 公告与主题新闻
  - title: 特征与证据
    detail: 趋势指标 · 数据来源 · 时间戳 · 证据等级
  - title: 分级与复核
    detail: L0–L4 规则 · 可选 AI 复核 · 发送条件检查
  - title: 去重与输出
    detail: 事件状态 · 冷却时间 · 预警与定期报告
features:
  - index: "01"
    title: 行情数据接入
    description: 优先读取 Moomoo OpenD，使用 yfinance 作为带来源标记的后备。每条行情保留采集时间，方便检查数据是否过期。
  - index: "02"
    title: 趋势和新闻一起判断
    description: 计算收益率、均线、RSI、ATR 和成交量异常，再结合主题新闻与官方公告。只有价格变化的事件需要更多证据才能升级。
  - index: "03"
    title: 让同一件事少提醒几次
    description: 用事件指纹、冷却时间和预警状态记录已经处理的事件。风险等级、方向或证据发生实质变化后，再检查是否需要重新提醒。
  - index: "04"
    title: 中文问题也能找到标的
    description: 解析中文公司名、繁体别名、英文名称、股票代码和主题词，将问题匹配到系统关注的标的。
engineering:
  - title: 先把判断规则写清楚
    detail: 特征计算、标的解析、去重和发送条件由确定性代码处理。AI 可以参与符合条件的事件复核，输出仍要经过证据和通知规则检查。
  - title: 给每条数据保留出处
    detail: 行情携带来源和时间，新闻按来源质量分级。后备数据源不会被当成主数据源展示，价格信号也不会直接等同于新闻结论。
  - title: 用测试检查重复提醒和越界行为
    detail: 回归测试覆盖快照未变化、冷却时间、主题共振、复核内容不完整和低等级事件不调用 AI 等情形；GitHub Actions 运行仓库测试。
  - title: 将分析与交易分开实现
    detail: 应用只读取行情与持仓，配置固定关闭券商写操作。公开仓库不提供下单路径，也不包含个人持仓和生产凭据。
principles:
  - 这是信息分析与预警项目，结果需要结合原始证据判断
  - AI 服务不可用时，确定性扫描和数据整理仍能继续
  - 公开版本的对外发送默认关闭，接入通知渠道需要自行配置
stack:
  - Python
  - Moomoo OpenD
  - yfinance
  - pytest
  - GitHub Actions
evidence:
  - label: 系统说明
    url: https://github.com/jasperjlou/market-watchdog#architecture
  - label: 信号与去重测试
    url: https://github.com/jasperjlou/market-watchdog/blob/main/agent/tests/test_market_signal_engine.py
  - label: 预警复核测试
    url: https://github.com/jasperjlou/market-watchdog/blob/main/agent/tests/test_warning_review_dispatcher.py
  - label: CI 运行记录
    url: https://github.com/jasperjlou/market-watchdog/actions/workflows/tests.yml
---

我想持续跟踪市场里的变化，但价格、新闻和公告往往分散在不同地方。同一条消息也可能被重复转载，最后收到很多提醒，却不容易看清到底发生了什么。

这个项目把采集、分析和通知拆成几个步骤。我先让代码整理数据、计算特征、检查证据，再决定哪些事件需要复核和提醒。项目的技术重点是数据来源、分级规则和事件状态，而不是给出一个没有解释的涨跌结论。

公开仓库展示实现方法和回归测试。当前页面没有公开在线演示，也没有用历史回测或收益率来证明分析效果。
