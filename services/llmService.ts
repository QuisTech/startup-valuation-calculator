import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { ValuationFormData, ValuationCalculation } from '../types';

const llm = new ChatOpenAI({
  temperature: 0.7,
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const swotTemplate = `
You are an expert startup analyst. Based on the following startup information and valuation, provide a comprehensive SWOT analysis.

Startup Details:
- Company: {companyName}
- Industry: {industry}
- Monthly Revenue: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat('{monthlyRevenue}'))}
- User Count: {userCount}
- Growth Rate: {growthRate}%
- Market Size: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat('{marketSize}'))}
- Funding Stage: {fundingStage}
- Team Size: {teamSize}
- Calculated Valuation: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat('{valuation}'))}

Please provide a SWOT analysis with:
- 3-4 specific, actionable strengths
- 3-4 specific, actionable weaknesses  
- 3-4 specific, actionable opportunities
- 3-4 specific, actionable threats

Format the response as a JSON object with this exact structure:
{{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "threats": ["threat1", "threat2", "threat3"]
}}

Focus on factors that would be most relevant to investors and the specific valuation calculated.
`;

const swotPrompt = new PromptTemplate({
  template: swotTemplate,
  inputVariables: ['companyName', 'industry', 'monthlyRevenue', 'userCount', 'growthRate', 'marketSize', 'fundingStage', 'teamSize', 'valuation']
});

const swotChain = new LLMChain({
  llm: llm,
  prompt: swotPrompt
});

export async function generateSWOTAnalysis(startupData: ValuationFormData, valuation: ValuationCalculation) {
  try {
    const response = await swotChain.call({
      companyName: startupData.companyName,
      industry: startupData.industry,
      monthlyRevenue: startupData.monthlyRevenue.toString(),
      userCount: startupData.userCount.toString(),
      growthRate: startupData.growthRate.toString(),
      marketSize: startupData.marketSize.toString(),
      fundingStage: startupData.fundingStage,
      teamSize: startupData.teamSize.toString(),
      valuation: valuation.estimatedValue.toString()
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Error generating SWOT analysis:', error);
    
    return {
      strengths: [
        "Strong revenue generation potential",
        "Growing user base in target market",
        "Experienced founding team"
      ],
      weaknesses: [
        "Limited market share in competitive space",
        "Dependence on current growth trajectory",
        "Need for additional funding to scale"
      ],
      opportunities: [
        "Market expansion opportunities",
        "Potential for product diversification",
        "Growing demand in target industry"
      ],
      threats: [
        "Increasing competition in the market",
        "Economic downturn affecting funding",
        "Regulatory changes in the industry"
      ]
    };
  }
}