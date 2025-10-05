import { INDUSTRY_MULTIPLIERS, STAGE_MULTIPLIERS, GROWTH_RATE_FACTORS } from '../utils/constants';
import { ValuationFormData, ValuationCalculation } from '../types';

function getGrowthFactor(growthRate: number): number {
  if (growthRate <= 10) return GROWTH_RATE_FACTORS.low;
  if (growthRate <= 25) return GROWTH_RATE_FACTORS.medium;
  if (growthRate <= 50) return GROWTH_RATE_FACTORS.high;
  return GROWTH_RATE_FACTORS.exceptional;
}

function calculateTeamScore(teamSize: number): number {
  if (teamSize === 0) return 0.8;
  if (teamSize <= 5) return 1.0;
  if (teamSize <= 15) return 1.2;
  if (teamSize <= 30) return 1.5;
  return 1.8;
}

function calculateMarketShareScore(monthlyRevenue: number, marketSize: number): number {
  if (marketSize === 0) return 1.0;
  const marketShare = (monthlyRevenue * 12) / marketSize;
  if (marketShare < 0.001) return 0.8;
  if (marketShare < 0.01) return 1.0;
  if (marketShare < 0.05) return 1.3;
  if (marketShare < 0.1) return 1.6;
  return 2.0;
}

export async function calculateValuation(startupData: ValuationFormData): Promise<ValuationCalculation> {
  const {
    industry,
    monthlyRevenue,
    userCount,
    growthRate,
    marketSize,
    fundingStage,
    teamSize,
    profitMargin
  } = startupData;

  const industryMultiplier = INDUSTRY_MULTIPLIERS[industry as keyof typeof INDUSTRY_MULTIPLIERS] || INDUSTRY_MULTIPLIERS.other;
  const stageMultiplier = STAGE_MULTIPLIERS[fundingStage as keyof typeof STAGE_MULTIPLIERS] || 1.0;
  const growthFactor = getGrowthFactor(growthRate);
  const teamScore = calculateTeamScore(teamSize);
  const marketShareScore = calculateMarketShareScore(monthlyRevenue, marketSize);
  const profitFactor = 1 + (profitMargin / 100) * 0.5;

  const annualRevenue = monthlyRevenue * 12;
  let baseValuation = annualRevenue * industryMultiplier.revenue;
  const userValuation = userCount * industryMultiplier.user;

  let estimatedValue = (baseValuation * 0.7 + userValuation * 0.3);
  estimatedValue *= stageMultiplier * growthFactor * teamScore * marketShareScore * profitFactor;

  const range = {
    low: estimatedValue * 0.75,
    high: estimatedValue * 1.25
  };

  const revenueMultiple = estimatedValue / annualRevenue;
  const userValue = userCount > 0 ? estimatedValue / userCount : 0;
  const calculatedMarketShare = marketSize > 0 ? (annualRevenue / marketSize) * 100 : 0;

  return {
    estimatedValue: Math.round(estimatedValue),
    range: {
      low: Math.round(range.low),
      high: Math.round(range.high)
    },
    revenueMultiple,
    userValue,
    marketShare: calculatedMarketShare,
    baseValuation: Math.round(baseValuation),
    userValuation: Math.round(userValuation)
  };
}