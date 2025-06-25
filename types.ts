export interface LeaseData {
  startDate: string;
  endDate: string;
  rentAmount: string;
  landlord: string;
  tenant: string;
  propertyAddress: string;
  clausesDetected: string[];
  flaggedIssues: string[];
  // New fields for enhanced analysis
  riskScore: "Low" | "Moderate" | "High" | "N/A" | string; // Allow string for flexibility if Gemini returns other values
  riskJustification: string;
  policyDeviations: string[];
  summary: string;
  analysisNotes: string; // Notes from the AI about the analysis process itself
}

export interface DisplayLeaseData extends LeaseData {
   internalNotes?: string; // User-editable notes, not from AI
}


export interface SocialMediaLink {
  name: string;
  url: string;
  icon: React.FC<{ className?: string }>;
}

export interface AIAssistantInteraction { // Used for lease-specific Q&A
  question: string;
  answer: string;
  timestamp: Date;
}

// New type for the general AI Assistant chat messages
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
