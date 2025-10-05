import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFReportData {
  companyName: string;
  valuation: number;
  valuationRange: { low: number; high: number };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  keyMetrics: {
    revenueMultiple: number;
    userValue: number;
    marketShare: number;
  };
  formData: any;
  generatedAt: Date;
}

export class PDFService {
  static async generateValuationReport(data: PDFReportData): Promise<Blob> {
    return new Promise((resolve, reject) => {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        // Add header
        pdf.setFillColor(4, 120, 87); // Emerald color
        pdf.rect(0, 0, pageWidth, 60, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text('STARTUP VALUATION REPORT', pageWidth / 2, 25, { align: 'center' });
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on ${data.generatedAt.toLocaleDateString()}`, pageWidth / 2, 35, { align: 'center' });
        
        pdf.setTextColor(0, 0, 0);
        yPosition = 70;

        // Company Information
        this.addSectionHeader(pdf, 'Company Information', pageWidth, yPosition);
        yPosition += 15;
        
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Company:`, margin, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(data.companyName || 'Not specified', margin + 25, yPosition);
        
        yPosition += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Industry:`, margin, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(this.capitalizeFirstLetter(data.formData.industry), margin + 25, yPosition);
        
        yPosition += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Funding Stage:`, margin, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(this.formatFundingStage(data.formData.fundingStage), margin + 35, yPosition);

        yPosition += 20;

        // Valuation Summary
        this.addSectionHeader(pdf, 'Valuation Summary', pageWidth, yPosition);
        yPosition += 15;

        // Main valuation
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(4, 120, 87);
        pdf.text(`$${this.formatCurrency(data.valuation)}`, pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Estimated Company Valuation', pageWidth / 2, yPosition, { align: 'center' });

        yPosition += 15;
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Valuation Range: $${this.formatCurrency(data.valuationRange.low)} - $${this.formatCurrency(data.valuationRange.high)}`, margin, yPosition);

        yPosition += 20;

        // Key Metrics
        this.addSectionHeader(pdf, 'Key Metrics', pageWidth, yPosition);
        yPosition += 15;

        const metrics = [
          { label: 'Revenue Multiple', value: `${data.keyMetrics.revenueMultiple.toFixed(1)}x` },
          { label: 'Value per User', value: `$${this.formatCurrency(data.keyMetrics.userValue)}` },
          { label: 'Market Share', value: `${data.keyMetrics.marketShare.toFixed(3)}%` },
          { label: 'Monthly Revenue', value: `$${this.formatCurrency(data.formData.monthlyRevenue)}` },
          { label: 'User Count', value: data.formData.userCount.toLocaleString() },
          { label: 'Monthly Growth', value: `${data.formData.growthRate}%` },
        ];

        metrics.forEach((metric, index) => {
          const x = margin + (index % 2) * (pageWidth / 2 - margin);
          const y = yPosition + Math.floor(index / 2) * 10;
          
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${metric.label}:`, x, y);
          pdf.setFont('helvetica', 'normal');
          pdf.text(metric.value, x + 40, y);
        });

        yPosition += 30;

        // SWOT Analysis
        this.addSectionHeader(pdf, 'SWOT Analysis', pageWidth, yPosition);
        yPosition += 15;

        // Check if we need a new page
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        const swotData = [
          { title: 'Strengths', items: data.swotAnalysis.strengths, color: [34, 197, 94] },
          { title: 'Weaknesses', items: data.swotAnalysis.weaknesses, color: [239, 68, 68] },
          { title: 'Opportunities', items: data.swotAnalysis.opportunities, color: [59, 130, 246] },
          { title: 'Threats', items: data.swotAnalysis.threats, color: [249, 115, 22] },
        ];

        swotData.forEach((section, index) => {
          const x = margin + (index % 2) * (pageWidth / 2 - margin);
          let y = yPosition + Math.floor(index / 2) * 60;

          // Section box
          pdf.setFillColor(section.color[0], section.color[1], section.color[2]);
          pdf.rect(x, y, pageWidth / 2 - margin - 5, 15, 'F');
          
          pdf.setTextColor(255, 255, 255);
          pdf.setFont('helvetica', 'bold');
          pdf.text(section.title, x + 5, y + 10);

          // Items
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          
          section.items.forEach((item, itemIndex) => {
            if (itemIndex < 3) { // Limit to 3 items per section
              const itemY = y + 20 + (itemIndex * 8);
              pdf.text(`• ${item}`, x + 5, itemY, { maxWidth: pageWidth / 2 - margin - 15 });
            }
          });
        });

        yPosition += 130;

        // Disclaimer
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = margin;
        }

        this.addSectionHeader(pdf, 'Disclaimer', pageWidth, yPosition);
        yPosition += 15;
        
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.setFont('helvetica', 'italic');
        const disclaimer = `This valuation report is generated for informational purposes only and should not be considered as financial advice. The valuation is based on the provided data and industry-standard methodologies. Actual company valuation may vary based on market conditions, due diligence, and other factors. Consult with qualified financial advisors before making investment decisions.`;
        pdf.text(disclaimer, margin, yPosition, { maxWidth: pageWidth - 2 * margin, align: 'justify' });

        // Generate blob
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);

      } catch (error) {
        reject(error);
      }
    });
  }

  private static addSectionHeader(pdf: jsPDF, text: string, pageWidth: number, y: number) {
    pdf.setFillColor(243, 244, 246); // Light gray
    pdf.rect(0, y - 5, pageWidth, 12, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, 20, y + 3);
  }

  private static formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(2) + 'M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(2) + 'K';
    }
    return amount.toFixed(2);
  }

  private static capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private static formatFundingStage(stage: string): string {
    const stageMap: { [key: string]: string } = {
      'pre-seed': 'Pre-Seed',
      'seed': 'Seed',
      'series-a': 'Series A',
      'series-b': 'Series B', 
      'series-c': 'Series C+'
    };
    return stageMap[stage] || stage;
  }
}