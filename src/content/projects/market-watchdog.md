---
title: Market Watchdog
englishTitle: Read-only Market Intelligence System
category: ai-tools
repositoryVisibility: public
visual: pipeline
order: 3
status: Public source · Read-only by design · Active
statusDetail: The public repository includes market-data routing, feature extraction, evidence grading, stateful alerting, optional AI coordination, runtime-isolation policy, read-only portfolio snapshot support, and regression tests. Broker writes remain outside the application path.
description: A read-only market intelligence system for U.S. equities that combines market data, filings/news evidence, deterministic risk gates, optional bounded AI review, and stateful deduplication.
summary: >-
  I built Market Watchdog to answer a practical problem: price moves, filings, and news arrive from different sources, while repeated coverage can create noisy alerts. The system keeps source/time metadata, grades evidence, tracks event state, and only escalates events that pass explicit rules.
githubUrl: https://github.com/jasperjlou/market-watchdog
launched: "2026.09 · ongoing"
lastVerified: 2026-09-29
metrics: []
pipeline:
  - title: Read-only market inputs
    detail: Moomoo OpenD · yfinance fallback · optional IBKR snapshot path · filings/news
  - title: Normalization and features
    detail: Source timestamps · returns · moving averages · RSI · ATR · volume anomalies
  - title: Evidence and risk gates
    detail: L0–L4 grading · source quality · deterministic fusion · authorization policy
  - title: Optional AI review
    detail: Bounded coordinator/workers · schema checks · cannot bypass safety rules
  - title: Stateful alerting
    detail: Event fingerprints · cooldowns · deduplication · daily/weekly outputs
features:
  - index: "01"
    title: Provider-aware market data
    description: The checked-in policy currently prioritizes Moomoo OpenD and uses yfinance as a labelled fallback. An IBKR read-only provider path exists but is disabled by default in the current market-data configuration.
  - index: "02"
    title: Evidence before explanation
    description: Returns, trend features, volatility, and volume anomalies are combined with independent evidence such as filings and news instead of treating a price move as its own causal explanation.
  - index: "03"
    title: Stateful deduplication
    description: Alerts retain event identity, severity, direction, evidence state, and cooldown history. Re-alerting is reserved for material changes instead of repeated copies of the same story.
  - index: "04"
    title: Optional AI orchestration
    description: AI workers can review qualified events or help prepare reports, but their output remains subject to the same schemas, evidence gates, and authorization policy as deterministic components.
  - index: "05"
    title: Runtime isolation
    description: Market scanning, AI workers, messaging integrations, and optional sidecars are independently gated so one unavailable integration does not collapse the core scanner.
  - index: "06"
    title: Read-only safety boundary
    description: Broker-write operations are outside the shipped application flow. Current policy disables actual broker writes and keeps account/position access read-only.
engineering:
  - title: Keep price data labelled by source and age
    detail: Quote paths preserve provider and collection time. Fallback data is not silently presented as equivalent to the primary source, and stale/fresh data classes remain distinguishable.
  - title: Let deterministic code own permissions
    detail: Symbol resolution, feature calculation, alert grading, deduplication, and capability checks are code/config responsibilities. AI output is advisory and cannot grant itself broker or messaging permissions.
  - title: Separate event state from message text
    detail: A warning is not just a generated sentence. The system stores what event it represents, what evidence supports it, whether it has already been surfaced, and what changed since the last notification.
  - title: Make optional integrations fail independently
    detail: The repository includes coordinator, communication, portfolio-snapshot, and integration-registry layers, but unavailable optional services should not stop the deterministic market-data and evidence pipeline.
principles:
  - This is an analysis and alerting project, not an execution system or investment recommendation service.
  - AI output does not override evidence requirements or authorization checks.
  - Public source excludes personal financial data, production credentials, and private communication state.
  - Optional IBKR support is read-only and off by default in the current checked-in provider configuration.
stack:
  - Python
  - Moomoo OpenD
  - yfinance
  - YAML policy
  - pytest
  - GitHub Actions
evidence:
  - label: Repository architecture
    url: https://github.com/jasperjlou/market-watchdog#current-system-topology
  - label: Market data policy
    url: https://github.com/jasperjlou/market-watchdog/blob/main/config/market_data.yaml
  - label: Runtime isolation notes
    url: https://github.com/jasperjlou/market-watchdog/blob/main/docs/runtime_isolation.md
  - label: CI workflow
    url: https://github.com/jasperjlou/market-watchdog/actions/workflows/tests.yml
---

Market Watchdog grew from a personal need to follow market changes without turning every price move or repeated headline into another notification. I separated the problem into data collection, feature computation, evidence quality, event state, optional model review, and delivery policy.

The latest repository is larger than the original signal scanner: it now includes explicit runtime-isolation rules, AI orchestration, communication gates, read-only portfolio snapshot tooling, integration metadata, and recurring report generation. The safety boundary remains the same — analysis can become more capable without quietly turning the project into a trading executor.
