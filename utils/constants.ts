export const INDUSTRY_MULTIPLIERS = {
  technology: { revenue: 8, user: 100 },
  saas: { revenue: 12, user: 150 },
  ecommerce: { revenue: 3, user: 50 },
  healthcare: { revenue: 6, user: 200 },
  finance: { revenue: 10, user: 300 },
  other: { revenue: 4, user: 75 }
};

export const STAGE_MULTIPLIERS = {
  'pre-seed': 0.8,
  'seed': 1.0,
  'series-a': 1.5,
  'series-b': 2.0,
  'series-c': 3.0
};

export const GROWTH_RATE_FACTORS = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
  exceptional: 3.0
};