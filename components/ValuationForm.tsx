'use client';

import { useState } from 'react';
import { ValuationFormData, ValuationResult } from '../types';
import { PDFService } from '../services/pdfService';

export default function ValuationForm() {
  const [formData, setFormData] = useState<ValuationFormData>({
    companyName: '',
    industry: 'technology',
    monthlyRevenue: undefined as unknown as number, // This will make it empty
    userCount: undefined as unknown as number,
    growthRate: undefined as unknown as number,
    marketSize: undefined as unknown as number,
    fundingStage: 'seed',
    teamSize: undefined as unknown as number,
    profitMargin: undefined as unknown as number,
  });

  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that numeric fields are filled
    if (formData.monthlyRevenue === undefined || 
        formData.userCount === undefined || 
        formData.growthRate === undefined || 
        formData.marketSize === undefined || 
        formData.teamSize === undefined) {
      alert('Please fill in all numeric fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/calculate-valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Ensure zeros for undefined values
          monthlyRevenue: formData.monthlyRevenue || 0,
          userCount: formData.userCount || 0,
          growthRate: formData.growthRate || 0,
          marketSize: formData.marketSize || 0,
          teamSize: formData.teamSize || 0,
          profitMargin: formData.profitMargin || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate valuation');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error calculating valuation:', error);
      alert('Error calculating valuation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Revenue') || name.includes('Count') || name.includes('Rate') || name.includes('Size') || name.includes('Margin') 
        ? value === '' ? undefined : parseFloat(value) 
        : value
    }));
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    
    setGeneratingPDF(true);
    try {
      const pdfBlob = await PDFService.generateValuationReport({
        companyName: formData.companyName,
        valuation: result.valuation,
        valuationRange: result.valuationRange,
        swotAnalysis: result.swotAnalysis,
        keyMetrics: result.keyMetrics,
        formData: formData,
        generatedAt: new Date(),
      });

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.companyName || 'startup'}-valuation-report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-emerald-800 mb-6">Startup Valuation Calculator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="technology">Technology</option>
              <option value="saas">SaaS</option>
              <option value="ecommerce">E-commerce</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Revenue ($) *
            </label>
            <input
              type="number"
              name="monthlyRevenue"
              value={formData.monthlyRevenue === undefined ? '' : formData.monthlyRevenue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
              step="1000"
              required
              placeholder="e.g., 50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Count *
            </label>
            <input
              type="number"
              name="userCount"
              value={formData.userCount === undefined ? '' : formData.userCount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
              required
              placeholder="e.g., 2500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Growth Rate (%) *
            </label>
            <input
              type="number"
              name="growthRate"
              value={formData.growthRate === undefined ? '' : formData.growthRate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
              max="100"
              step="0.1"
              required
              placeholder="e.g., 15.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Size ($) *
            </label>
            <input
              type="number"
              name="marketSize"
              value={formData.marketSize === undefined ? '' : formData.marketSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
              step="1000000"
              required
              placeholder="e.g., 50000000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funding Stage *
            </label>
            <select
              name="fundingStage"
              value={formData.fundingStage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              <option value="pre-seed">Pre-seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b">Series B</option>
              <option value="series-c">Series C+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Size *
            </label>
            <input
              type="number"
              name="teamSize"
              value={formData.teamSize === undefined ? '' : formData.teamSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              min="0"
              required
              placeholder="e.g., 15"
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4">
          * Required fields. Please enter 0 if a metric is not applicable.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Calculate Valuation'}
        </button>
      </form>

      {/* Rest of your results section remains the same */}
      {result && (
        <div className="mt-8 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-emerald-800">Valuation Results</h3>
              <button
                onClick={handleDownloadPDF}
                disabled={generatingPDF}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2 whitespace-nowrap"
              >
                {generatingPDF ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download PDF Report</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-emerald-700">
                  ${(result.valuation / 1000000).toFixed(2)}M
                </div>
                <div className="text-sm text-emerald-600">Estimated Valuation</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-700">
                  ${(result.valuationRange.low / 1000000).toFixed(2)}M - ${(result.valuationRange.high / 1000000).toFixed(2)}M
                </div>
                <div className="text-sm text-blue-600">Valuation Range</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-700">
                  {result.keyMetrics.revenueMultiple.toFixed(1)}x
                </div>
                <div className="text-sm text-purple-600">Revenue Multiple</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg text-green-600 mb-3">Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.swotAnalysis.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-red-600 mb-3">Weaknesses</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.swotAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-blue-600 mb-3">Opportunities</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.swotAnalysis.opportunities.map((opportunity, index) => (
                    <li key={index}>{opportunity}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg text-orange-600 mb-3">Threats</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.swotAnalysis.threats.map((threat, index) => (
                    <li key={index}>{threat}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-lg text-gray-800 mb-2">Report Features</h4>
              <p className="text-sm text-gray-600">
                The PDF report includes: Company information, detailed valuation breakdown, key metrics, 
                comprehensive SWOT analysis, and professional formatting suitable for investor presentations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}