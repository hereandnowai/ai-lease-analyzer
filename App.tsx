
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import LeaseDataDisplay from './components/LeaseDataDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import HomePage from './components/HomePage';
import AIAssistantWidget from './components/AIAssistantWidget';
import { LeaseData, DisplayLeaseData, ChatMessage } from './types';
import { analyzeLeaseWithGemini, askAboutLeaseWithGemini, createGeneralChatSession } from './services/geminiService';
import { BRANDING_INFO } from './constants';
import type { Chat } from '@google/genai'; // Import Chat type

// Helper function to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to export data as CSV
const exportToCSV = (data: DisplayLeaseData, filename: string = 'lease_analysis.csv') => {
  const headers = [
    "Start Date", "End Date", "Rent Amount", "Landlord", "Tenant", 
    "Property Address", "Clauses Detected", "Flagged Issues",
    "Risk Score", "Risk Justification", "Policy Deviations", "AI Summary", "AI Analysis Notes", "Internal Notes"
  ];
  
  const clausesDetectedStr = data.clausesDetected.join('; ');
  const flaggedIssuesStr = data.flaggedIssues.join('; ');
  const policyDeviationsStr = data.policyDeviations.join('; ');

  const rowData = [
    data.startDate, data.endDate, data.rentAmount, data.landlord, data.tenant,
    data.propertyAddress, clausesDetectedStr, flaggedIssuesStr,
    data.riskScore, data.riskJustification, policyDeviationsStr, data.summary, data.analysisNotes, data.internalNotes || ""
  ];
  
  const row = rowData.map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(',');

  const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + row;
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const initialLeaseDataState: DisplayLeaseData | null = null;
const API_KEY_AVAILABLE = !!process.env.API_KEY;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'analyzer'>('home');
  const [leaseData, setLeaseData] = useState<DisplayLeaseData | null>(initialLeaseDataState);
  const [isLoading, setIsLoading] = useState<boolean>(false); // For lease analysis
  const [error, setError] = useState<string | null>(null); // For lease analysis
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [processedFileCount, setProcessedFileCount] = useState(0); 

  // AI Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantChatSession, setAssistantChatSession] = useState<Chat | null>(null);
  const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);

  useEffect(() => {
    if (API_KEY_AVAILABLE) {
      try {
        setAssistantChatSession(createGeneralChatSession());
         setAssistantMessages([{
            id: crypto.randomUUID(),
            text: `Hello! I'm your AI Assistant from ${BRANDING_INFO.organizationShortName}. How can I help you today?`,
            sender: 'ai',
            timestamp: new Date()
        }]);
      } catch (e: any) {
        console.error("Failed to initialize AI Assistant chat session:", e);
        setAssistantError("Could not initialize AI Assistant: " + e.message);
      }
    }
  }, []);


  const resetAnalysisState = () => {
    setLeaseData(initialLeaseDataState);
    setError(null);
    setIsLoading(false);
    setCurrentFileName(null);
    setProcessedFileCount(0);
  };

  const navigateToHome = useCallback(() => {
    setCurrentView('home');
    resetAnalysisState();
  }, []);

  const navigateToAnalyzer = useCallback(() => {
    setCurrentView('analyzer');
  }, []);

  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return;
    if (!API_KEY_AVAILABLE) {
        setError("Cannot analyze lease: API Key is not configured.");
        return;
    }
    
    const fileToProcess = files[0];
    
    setIsLoading(true);
    setError(null);
    setLeaseData(initialLeaseDataState);
    setCurrentFileName(fileToProcess.name);
    setProcessedFileCount(0);

    try {
      const base64FileContent = await fileToBase64(fileToProcess);
      const dataFromAI = await analyzeLeaseWithGemini(fileToProcess, base64FileContent);
      setLeaseData({
        ...dataFromAI,
        internalNotes: "" 
      });
      setProcessedFileCount(1);
    } catch (err) {
      console.error("Analysis error:", err);
      if (err instanceof Error) {
        setError(`Failed to analyze lease: ${err.message}`);
      } else {
        setError("An unknown error occurred during analysis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExportCSV = useCallback(() => {
    if (leaseData) {
      const exportFileName = currentFileName ? `lease_analysis_${currentFileName.split('.')[0]}.csv` : 'lease_analysis.csv';
      exportToCSV(leaseData, exportFileName);
    }
  }, [leaseData, currentFileName]);

  // For lease-specific Q&A
  const handleAskAIAboutLease = useCallback(async (question: string, context: string): Promise<string | null> => {
    if (!leaseData || !API_KEY_AVAILABLE) return "No lease data loaded or API Key missing.";
    try {
      const answer = await askAboutLeaseWithGemini(context, question);
      return answer;
    } catch (err: any) {
      console.error("Error asking AI about lease:", err);
      return `Error: ${err.message || "Failed to get response from AI."}`;
    }
  }, [leaseData]);

  const handleUpdateInternalNotes = useCallback((notes: string) => {
    setLeaseData(prevData => prevData ? { ...prevData, internalNotes: notes } : null);
    console.log("Internal notes updated:", notes);
  }, []);

  // AI Assistant Widget handlers
  const toggleAssistant = useCallback(() => setIsAssistantOpen(prev => !prev), []);

  const handleSendAssistantMessage = useCallback(async (messageText: string) => {
    if (!assistantChatSession || !API_KEY_AVAILABLE) {
      setAssistantError("Assistant is not available or API Key missing.");
      return;
    }

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setAssistantMessages(prev => [...prev, newUserMessage]);
    setIsAssistantLoading(true);
    setAssistantError(null);

    try {
      const response = await assistantChatSession.sendMessage({ message: messageText });
      const aiResponseText = response.text;
      
      const newAiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setAssistantMessages(prev => [...prev, newAiMessage]);
    } catch (err: any) {
      console.error("Error sending message to AI assistant:", err);
      const errorMessage = `AI Assistant Error: ${err.message || "Failed to get response."}`;
      setAssistantError(errorMessage);
       const errorAiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: `Sorry, I encountered an error: ${err.message || "Could not process request."}`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setAssistantMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsAssistantLoading(false);
    }
  }, [assistantChatSession]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header onLogoClick={navigateToHome} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <HomePage onGetStarted={navigateToAnalyzer} />
        )}

        {currentView === 'analyzer' && (
          <>
            {!API_KEY_AVAILABLE && (
                <div className="mb-6 max-w-2xl mx-auto p-4 rounded-md border text-center" style={{ backgroundColor: BRANDING_INFO.colors.primary, borderColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.secondary }}>
                    <strong className="font-semibold">API Key Missing:</strong> The application requires a Gemini API key for analysis features. Lease analysis will not work.
                </div>
            )}

            <FileUpload 
              onFileUpload={handleFileUpload} 
              isLoading={isLoading} 
              processedFileCount={processedFileCount}
            />
            
            {isLoading && (
              <div className="mt-8 flex justify-center">
                <LoadingSpinner />
              </div>
            )}

            {error && (
              <div className="mt-8 max-w-3xl mx-auto p-4 rounded-md bg-red-100 border border-red-300 text-red-700 text-center">
                <p className="font-semibold">Analysis Error</p>
                <p>{error}</p>
                {currentFileName && <p className="text-sm mt-1">File: {currentFileName}</p>}
              </div>
            )}

            {leaseData && !isLoading && !error && (
              <LeaseDataDisplay 
                data={leaseData} 
                fileName={currentFileName}
                onExportCSV={handleExportCSV}
                onAskAI={handleAskAIAboutLease} // Corrected prop name
                onUpdateInternalNotes={handleUpdateInternalNotes}
              />
            )}
            
          </>
        )}
      </main>
      <Footer />
      <AIAssistantWidget
        isOpen={isAssistantOpen}
        onToggle={toggleAssistant}
        messages={assistantMessages}
        onSendMessage={handleSendAssistantMessage}
        isLoading={isAssistantLoading}
        error={assistantError}
        apiKeyAvailable={API_KEY_AVAILABLE}
      />
    </div>
  );
};

export default App;
