// Base types for better organization
export type Industry = 'technology' | 'saas' | 'ecommerce' | 'healthcare' | 'finance' | 'other';
export type FundingStage = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c';

export interface ValuationFormData {
  companyName: string;
  industry: Industry;
  monthlyRevenue: number;
  userCount: number;
  growthRate: number;
  marketSize: number;
  fundingStage: FundingStage;
  teamSize: number;
  profitMargin: number;
}

export interface ValuationRange {
  low: number;
  high: number;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface KeyMetrics {
  revenueMultiple: number;
  userValue: number;
  marketShare: number;
}

export interface ValuationResult {
  valuation: number;
  valuationRange: ValuationRange;
  swotAnalysis: SWOTAnalysis;
  keyMetrics: KeyMetrics;
}

export interface ValuationCalculation {
  estimatedValue: number;
  range: ValuationRange;
  revenueMultiple: number;
  userValue: number;
  marketShare: number;
  baseValuation: number;
  userValuation: number;
}

export interface PDFReportData {
  companyName: string;
  valuation: number;
  valuationRange: ValuationRange;
  swotAnalysis: SWOTAnalysis;
  keyMetrics: KeyMetrics;
  formData: ValuationFormData;
  generatedAt: Date;
}