export const PROJECT_GROUPS = [
  {
    id: 'agent-world',
    title: 'Agent Worlds',
    subtitle: 'Interactive environments and evaluation',
    description: 'Spatial environments where agents must navigate, act under time constraints, recover from mistakes, and leave reproducible trajectories that can be independently evaluated.',
  },
  {
    id: 'holistic-assistant',
    title: 'Holistic Assistant',
    subtitle: 'Curriculum-aware academic planning',
    description: 'A long-running academic planning system that turns official curriculum material, SIS course data, and structured rules into editable plans and grounded guidance.',
  },
  {
    id: 'ai-tools',
    title: 'AI + Tools',
    subtitle: 'Applied AI infrastructure and decision-support systems',
    description: 'Engineering projects built around evidence, state, reproducibility, safety boundaries, and practical workflows rather than one-shot model output.',
  },
] as const;
