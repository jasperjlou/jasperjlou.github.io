---
title: Holistic Assistant
englishTitle: CUHK-Shenzhen Academic Planning System
category: holistic-assistant
repositoryVisibility: private
visual: campus
technicalTitle: Keep curriculum structure explicit, then let AI explain around it.
order: 2
status: Private source · Public service · Active
statusDetail: The current repository separates structured course and curriculum logic from model-generated text, prebuilds layered course indexes, and exposes health/data diagnostics for deployment. Source remains private because the full project includes deployment and working data context.
description: A curriculum-aware academic planning system that combines official university documents, SIS-derived course data, structured graduation rules, editable roadmaps, prerequisite checks, and bounded AI assistance.
summary: Holistic Assistant began as a PDF question-answering prototype and evolved into a planning system where curriculum structure, programme tracks, course data, and editable roadmaps are represented explicitly instead of being left for a model to reconstruct from prose.
liveUrl: https://holisticassistant.com/
githubUrl: https://github.com/jasperjlou/holistic-assistant
launched: "2025.10 · ongoing"
lastVerified: 2026-09-29
heroImage: /assets/campus/academic-courtyard.webp
heroAlt: CUHK-Shenzhen academic courtyard and elevated walkways
metrics:
  - value: "19,959 / 19,959"
    label: evaluation checks passed
    note: Stored output-quality evaluation snapshot generated 2026-05-27.
  - value: "75"
    label: roadmap variants
    note: Stored output-quality evaluation snapshot generated 2026-05-27.
  - value: "0"
    label: failures
    note: In the 2026-05-27 stored evaluation snapshot.
  - value: "0"
    label: warnings
    note: In the 2026-05-27 stored evaluation snapshot.
pipeline:
  - title: Official curriculum evidence
    detail: Curriculum PDFs · university-wide rules · SIS-derived course data
  - title: Structured academic context
    detail: Layered indexes · programme tracks · course groups · prerequisite context
  - title: Planning and retrieval
    detail: Roadmap engine · PDF knowledge layer · curated resources
  - title: Bounded model synthesis
    detail: Fast/reasoning model routing · explicit fallback · evidence-aware answers
  - title: Editable student output
    detail: Course guidance · multi-year roadmaps · re-checkable plans
features:
  - index: "01"
    title: Curriculum-aware consultation
    description: Answers can combine course metadata, programme requirements, university-wide rules, and official-document context instead of relying on model memory alone.
  - index: "02"
    title: Editable multi-year roadmaps
    description: The planner distinguishes fixed requirements, elective slots, grouped choices, and programme tracks so a plan remains editable without erasing the structure that produced it.
  - index: "03"
    title: Prerequisite and sequencing checks
    description: Course-context and roadmap logic are separated from the interface, making ordering constraints and programme-specific structures explicit and testable.
  - index: "04"
    title: Layered data loading
    description: Docker builds precompute course indexes; runtime workers load those caches while the PDF knowledge layer is lazy-loaded for document-grounded questions.
  - index: "05"
    title: Resource discovery
    description: Curated learning resources can be supplemented by optional web search without replacing the local curriculum and course indexes used for academic-rule claims.
  - index: "06"
    title: Runtime diagnostics
    description: Separate health, diagnostics, and data-status endpoints make service availability distinguishable from curriculum/index correctness.
engineering:
  - title: Do not ask a model to reconstruct the curriculum from scratch
    detail: Programme structure is represented in course indexes, graduation-rule caches, roadmap objects, and explicit context assembly. The model works around that structure rather than silently defining it.
  - title: Keep elective structure visible
    detail: Fixed courses, elective slots, streams, and multi-choice groups remain separate entities so a generated roadmap can be edited and validated without turning every open choice into a fabricated course assignment.
  - title: Make startup independent from a full corpus rescan
    detail: Layered indexes are built ahead of runtime. The service can report health without forcing PDF parsing, while document retrieval loads its knowledge layer when needed.
  - title: Treat model routing as configuration, not academic truth
    detail: The current source defaults to gemini-3.5-flash for fast requests, gemini-2.5-pro for reasoning, and gemini-embedding-2 for embeddings; bounded fallback behavior is covered by repository tests.
principles:
  - Official documents and structured course data take priority over model prose.
  - Missing academic evidence should remain missing instead of being filled by confident guesses.
  - Generated plans should remain editable and re-checkable.
  - Historical evaluation numbers describe their stored run and are not silently promoted into claims about every later deployment.
stack:
  - Flask
  - Gemini API
  - Hybrid retrieval
  - Layered JSON indexes
  - Vanilla JavaScript
  - Docker
  - Gunicorn
  - pytest
evidence: []
---

Holistic Assistant started with a simple question: could a model answer useful questions from curriculum PDFs? The harder problem turned out to be everything around that question — course catalogues, programme tracks, prerequisite relationships, university-wide rules, editable semester plans, deployment, and making sure generated language did not quietly replace the underlying academic structure.

The current architecture therefore treats structured curriculum data as the backbone of the system. Model calls are useful for interpretation and synthesis, but they sit on top of explicit course and planning state. A historical output-quality evaluation in the repository recorded 19,959 checks with no failures or warnings across that evaluation snapshot; I keep that result tied to its date rather than treating it as a permanent score for every later version.
