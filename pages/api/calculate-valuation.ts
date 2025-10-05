import { NextApiRequest, NextApiResponse } from 'next';
import { calculateValuation } from '../../services/valuationService';
import { generateSWOTAnalysis } from '../../services/llmService';
import { ValuationFormData } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const startupData: ValuationFormData = req.body;
    
    const valuation = await calculateValuation(startupData);
    const swotAnalysis = await generateSWOTAnalysis(startupData, valuation);
    
    res.json({
      valuation: valuation.estimatedValue,
      valuationRange: {
        low: valuation.range.low,
        high: valuation.range.high
      },
      swotAnalysis: swotAnalysis,
      keyMetrics: {
        revenueMultiple: valuation.revenueMultiple,
        userValue: valuation.userValue,
        marketShare: valuation.marketShare
      }
    });
    
  } catch (error) {
    console.error('Valuation calculation error:', error);
    res.status(500).json({ 
      error: 'Failed to calculate valuation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}