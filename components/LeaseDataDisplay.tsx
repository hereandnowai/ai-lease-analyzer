
import React, { useState, useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DisplayLeaseData, AIAssistantInteraction } from '../types';
import { 
    BRANDING_INFO, IconCheckCircle, IconAlertTriangle, IconDownload, IconPDF, IconEmail, 
    IconChat, IconLightbulb, IconDocumentText
} from '../constants';

interface LeaseDataDisplayProps {
  data: DisplayLeaseData;
  fileName: string | null;
  onExportCSV: () => void;
  onAskAI: (question: string, context: string) => Promise<string | null>; // Function to call Gemini for Q&A
  onUpdateInternalNotes: (notes: string) => void;
}

const DataRow: React.FC<{ label: string; value: string | string[] | undefined; customRender?: React.ReactNode }> = ({ label, value, customRender }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-gray-200 last:border-b-0">
    <dt className="text-sm font-medium text-gray-600">{label}</dt>
    <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2" style={{ color: BRANDING_INFO.colors.secondary }}>
      {customRender ? customRender : (
        Array.isArray(value) ? (
          value.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {value.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          ) : <span className="text-gray-500 italic">None</span>
        ) : (
          value || <span className="text-gray-500 italic">N/A</span>
        )
      )}
    </dd>
  </div>
);

const SectionCard: React.FC<{ title: string; icon?: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon: Icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <details className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden" open={isOpen} onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}>
            <summary 
                className="section-card-summary px-6 py-4 flex items-center justify-between cursor-pointer list-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{ backgroundColor: `rgba(0, 64, 64, 0.03)`, borderBottom: isOpen ? '1px solid #e5e7eb' : 'none' }}
                aria-expanded={isOpen}
                aria-controls={`section-${title.replace(/\s+/g, '-')}`}
            >
                <h3 className="text-xl font-semibold flex items-center" style={{ color: BRANDING_INFO.colors.secondary }}>
                    {Icon && <Icon className="w-6 h-6 mr-3" />}
                    {title}
                </h3>
                <span className={`section-card-summary-toggle transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            </summary>
            <div id={`section-${title.replace(/\s+/g, '-')}`} className="section-card-content p-6">
                {children}
            </div>
        </details>
    );
};


const LeaseDataDisplay: React.FC<LeaseDataDisplayProps> = ({ data, fileName, onExportCSV, onAskAI, onUpdateInternalNotes }) => {
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [internalNotes, setInternalNotes] = useState(data.internalNotes || "");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleAskAISubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    setAiAnswer(null);
    setAiError(null);
    
    const context = `Lease Summary: ${data.summary}\nKey Terms: Start Date: ${data.startDate}, End Date: ${data.endDate}, Rent: ${data.rentAmount}, Landlord: ${data.landlord}, Tenant: ${data.tenant}. Detected Clauses: ${data.clausesDetected.join(', ') || 'None'}. Flagged Issues: ${data.flaggedIssues.join(', ') || 'None'}.`;
    
    try {
      const result = await onAskAI(aiQuestion, context);
      setAiAnswer(result);
    } catch (err: any) {
      setAiError(err.message || "Failed to get answer from AI.");
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleInternalNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalNotes(e.target.value);
  };

  const handleInternalNotesBlur = () => {
    onUpdateInternalNotes(internalNotes);
  };

  const getRiskScoreColor = (score: string | undefined) => {
    switch (score?.toLowerCase()) {
      case 'low': return BRANDING_INFO.colors.riskLow;
      case 'moderate': return BRANDING_INFO.colors.riskModerate;
      case 'high': return BRANDING_INFO.colors.riskHigh;
      default: return BRANDING_INFO.colors.secondary; 
    }
  };

  const handleDownloadPdf = async () => {
    const reportElement = document.getElementById('lease-report-content-area');
    if (!reportElement) {
      alert("Error: Could not find report content to export.");
      return;
    }

    setIsDownloadingPdf(true);
    
    // Temporarily expand all details elements for full capture
    const detailsElements = reportElement.querySelectorAll('details');
    const initiallyOpenStates = Array.from(detailsElements).map(el => el.open);
    detailsElements.forEach(el => el.open = true);

    // Allow time for sections to expand and render before capture
    await new Promise(resolve => setTimeout(resolve, 300));


    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // If any external images were present
        logging: true, 
        onclone: (documentClone) => {
            // Ensure background colors are preserved for html2canvas
            // This is often needed for elements styled with Tailwind or utility classes
            const elementsToStyle = documentClone.querySelectorAll('.ai-analysis-note, .risk-score-pill, .flagged-issue-item, .policy-deviation-item, .no-issues-item, .no-deviations-item, .section-card-summary');
            elementsToStyle.forEach(el => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.setProperty('-webkit-print-color-adjust', 'exact', 'important');
                htmlEl.style.setProperty('color-adjust', 'exact', 'important');
                const bgColor = window.getComputedStyle(el).backgroundColor;
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                    htmlEl.style.backgroundColor = bgColor;
                }
            });
        }
      });

      // Restore original open states
      detailsElements.forEach((el, index) => el.open = initiallyOpenStates[index]);

      const imgData = canvas.toDataURL('image/png');
      
      // Use pixels as unit for jspdf for easier coordination with canvas
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4', // A4 page, jspdf will convert to pixels
        putOnlyUsedFonts: true,
        floatPrecision: 16 // or "smart"
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      // Calculate width and height of image in PDF to maintain aspect ratio, fitting to width
      const imgWidthInPdf = pdfPageWidth;
      const imgHeightInPdf = (imgProps.height * imgWidthInPdf) / imgProps.width;

      let heightLeft = imgHeightInPdf;
      let position = 0; // Top of the image

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidthInPdf, imgHeightInPdf);
      heightLeft -= pdfPageHeight;

      // Add more pages if the image is taller than the PDF page
      while (heightLeft > 0) {
        position -= pdfPageHeight; // Shift the image up for the next page
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidthInPdf, imgHeightInPdf);
        heightLeft -= pdfPageHeight;
      }
      
      const pdfFileName = fileName ? `lease_analysis_${fileName.split('.')[0]}.pdf` : 'lease_analysis.pdf';
      pdf.save(pdfFileName);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the PDF. Please check the console for details.");
    } finally {
      setIsDownloadingPdf(false);
      // Ensure details are restored even on error
      detailsElements.forEach((el, index) => el.open = initiallyOpenStates[index]);
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto mt-8" id="lease-report-content-area"> {/* ID for html2canvas */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-semibold mb-3 sm:mb-0" style={{ color: BRANDING_INFO.colors.secondary }}>
          Lease Analysis Report {fileName && <span className="text-lg text-gray-500">({fileName})</span>}
        </h2>
      </div>

      {data.analysisNotes && data.analysisNotes.toLowerCase() !== 'n/a' && data.analysisNotes.trim() !== '' && (
         <div className="ai-analysis-note mb-6 p-4 rounded-md border text-sm" style={{ backgroundColor: BRANDING_INFO.colors.primary, borderColor: BRANDING_INFO.colors.secondary, color: '#000000' }}>
            <strong className="font-semibold flex items-center"><IconLightbulb className="w-5 h-5 mr-2"/>AI Analysis Note:</strong>
            <p className="mt-1">{data.analysisNotes}</p>
        </div>
      )}
      
      {data.analysisNotes && data.analysisNotes.toLowerCase().includes("not appear to be a lease agreement") && (
        <div className="p-6 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-700 text-center">
          <IconAlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
          <p className="text-lg font-semibold">Document Type Mismatch</p>
          <p>{data.analysisNotes}</p>
          <p className="mt-2">Please upload a valid lease document for analysis.</p>
        </div>
      )}

      {!(data.analysisNotes && data.analysisNotes.toLowerCase().includes("not appear to be a lease agreement")) && (
        <>
          <SectionCard title="Key Lease Information" icon={IconDocumentText} defaultOpen={true}>
            <dl>
                <DataRow label="Start Date" value={data.startDate} />
                <DataRow label="End Date" value={data.endDate} />
                <DataRow label="Rent Amount" value={data.rentAmount} />
                <DataRow label="Landlord" value={data.landlord} />
                <DataRow label="Tenant" value={data.tenant} />
                <DataRow label="Property Address" value={data.propertyAddress} />
            </dl>
          </SectionCard>

          <SectionCard title="Clause Analysis & Risk Assessment" icon={IconAlertTriangle} defaultOpen={true}>
            <dl>
                <DataRow label="Risk Score" value={data.riskScore || "N/A"} customRender={
                    <span 
                        className="risk-score-pill px-3 py-1 text-sm font-semibold rounded-full text-white" 
                        style={{ backgroundColor: getRiskScoreColor(data.riskScore) }}
                    >
                        {data.riskScore || "N/A"}
                    </span>
                } />
                <DataRow label="Risk Justification" value={data.riskJustification} />
                <DataRow 
                    label="Clauses Detected" 
                    value={data.clausesDetected || []}
                    customRender={
                        data.clausesDetected && data.clausesDetected.length > 0 ? (
                        <ul className="space-y-1">
                            {data.clausesDetected.map((clause, index) => (
                            <li key={index} className="flex items-center">
                                <IconCheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                                <span style={{ color: BRANDING_INFO.colors.secondary }}>{clause}</span>
                            </li>
                            ))}
                        </ul>
                        ) : <span className="text-gray-500 italic">None detected</span>
                    } 
                />
                <DataRow 
                    label="Flagged Issues / Missing Clauses" 
                    value={data.flaggedIssues || []}
                    customRender={
                        data.flaggedIssues && data.flaggedIssues.length > 0 ? (
                        <ul className="space-y-1">
                            {data.flaggedIssues.map((issue, index) => (
                            <li key={index} className="flagged-issue-item flex items-start p-2 rounded-md bg-yellow-50 border border-yellow-200">
                                <IconAlertTriangle className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-[${BRANDING_INFO.colors.accent}]`}/>
                                <span className="text-yellow-800">{issue}</span>
                            </li>
                            ))}
                        </ul>
                        ) : (
                            <div className="no-issues-item flex items-center p-2 rounded-md bg-green-50 border border-green-200">
                                <IconCheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                                <span className="text-green-700">No critical issues flagged by AI.</span>
                            </div>
                        )
                    }
                />
                 <DataRow 
                    label="Potential Policy Deviations" 
                    value={data.policyDeviations || []}
                    customRender={
                        data.policyDeviations && data.policyDeviations.length > 0 ? (
                        <ul className="space-y-1">
                            {data.policyDeviations.map((deviation, index) => (
                            <li key={index} className="policy-deviation-item flex items-start p-2 rounded-md bg-orange-50 border border-orange-200">
                                <IconAlertTriangle className={`w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-orange-500`}/>
                                <span className="text-orange-800">{deviation}</span>
                            </li>
                            ))}
                        </ul>
                        ) : (
                            <div className="no-deviations-item flex items-center p-2 rounded-md">
                                <IconCheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                                <span className="text-gray-600">No significant deviations from common standards noted by AI.</span>
                            </div>
                        )
                    }
                />
            </dl>
          </SectionCard>

          <SectionCard title="AI-Generated Summary" icon={IconLightbulb} defaultOpen={true}>
            <p className="text-sm whitespace-pre-wrap" style={{ color: BRANDING_INFO.colors.secondary }}>
                {data.summary || <span className="text-gray-500 italic">No summary generated.</span>}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 ai-summary-actions">
                <button
                disabled 
                className="flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.primary }}
                >
                <IconPDF className="w-4 h-4 mr-1.5" />
                Download PDF
                </button>
                <button
                disabled 
                className="flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.primary }}
                >
                <IconEmail className="w-4 h-4 mr-1.5" />
                Email Summary
                </button>
            </div>
          </SectionCard>
          
          <SectionCard title="AI Legal Assistant" icon={IconChat} defaultOpen={false}>
            <form onSubmit={handleAskAISubmit} className="ai-legal-assistant-form">
              <textarea
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask a specific question about this lease (e.g., 'What are the conditions for early termination?')"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[--hna-secondary] focus:border-[--hna-secondary] transition-shadow"
                style={{'--hna-secondary': BRANDING_INFO.colors.secondary} as React.CSSProperties}
                rows={3}
                aria-label="Ask AI a question about this lease"
              />
              <button
                type="submit"
                disabled={isAiLoading || !aiQuestion.trim()}
                className="mt-2 flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.primary }}
              >
                {isAiLoading ? 'Thinking...' : 'Ask AI'}
              </button>
            </form>
            {isAiLoading && <p className="mt-3 text-sm italic" style={{color: BRANDING_INFO.colors.secondary}}>Waiting for AI response...</p>}
            {aiError && <p className="mt-3 text-sm text-red-600">Error: {aiError}</p>}
            {aiAnswer && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <h4 className="font-semibold text-sm mb-1" style={{color: BRANDING_INFO.colors.secondary}}>AI's Answer:</h4>
                <p className="text-sm whitespace-pre-wrap" style={{ color: BRANDING_INFO.colors.secondary }}>{aiAnswer}</p>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Internal Notes" icon={IconDocumentText} defaultOpen={false}>
            <textarea
                value={internalNotes}
                onChange={handleInternalNotesChange}
                onBlur={handleInternalNotesBlur}
                placeholder="Add your internal notes, observations, or reminders here..."
                className="internal-notes-textarea w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[--hna-secondary] focus:border-[--hna-secondary] transition-shadow"
                style={{'--hna-secondary': BRANDING_INFO.colors.secondary} as React.CSSProperties}
                rows={4}
                aria-label="Internal notes for this lease"
            />
            <p className="text-xs text-gray-500 mt-1">Notes are saved automatically when you click outside the text area.</p>
          </SectionCard>

          <SectionCard title="Export & Actions" icon={IconDownload} defaultOpen={true}>
            <div className="flex flex-wrap gap-3 lease-data-display-actions">
                <button
                onClick={onExportCSV}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ backgroundColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.primary }}
                disabled={isDownloadingPdf}
                >
                <IconDownload className="w-5 h-5 mr-2" />
                Export Full Analysis (CSV)
                </button>
                <button
                onClick={handleDownloadPdf}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ backgroundColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.primary }}
                aria-label="Download page as PDF"
                disabled={isDownloadingPdf}
                >
                <IconPDF className="w-5 h-5 mr-2" />
                {isDownloadingPdf ? 'Generating PDF...' : 'Download Page as PDF'}
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
                Tip for PDF: The entire report, including currently collapsed sections, will be captured. The generation might take a few moments.
            </p>
          </SectionCard>
        </>
      )}
      
      <div className="mt-8 p-4 rounded-md bg-blue-50 border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong className="font-semibold">Disclaimer:</strong> This analysis is AI-generated and for informational purposes only. It is not a substitute for professional legal advice. Always review your lease agreement thoroughly and consult with a qualified legal expert for decisions. Data is based on the quality and content of the uploaded document.
        </p>
      </div>
    </div>
  );
};

export default LeaseDataDisplay;