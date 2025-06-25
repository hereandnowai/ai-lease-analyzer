
import React from 'react';
import { 
    BRANDING_INFO, 
    IconArrowRight, 
    IconDocumentText, 
    IconCheckCircle, 
    IconUpload, 
    IconLightbulb, 
    IconDownload as IconDownloadConstant,
    IconAlertTriangle, // Added import
    IconChat,          // Added import
    IconTranslateAlt,  // Added import
    IconLock           // Added import
} from '../constants';

interface HomePageProps {
  onGetStarted: () => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <h2 
    className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${className}`}
    style={{ color: BRANDING_INFO.colors.secondary }}
  >
    {children}
  </h2>
);

const FeatureListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start mb-2">
        <IconCheckCircle className={`w-5 h-5 mr-2 mt-1 flex-shrink-0 text-[${BRANDING_INFO.colors.secondary}]`} />
        <span className="text-gray-700">{children}</span>
    </li>
);


const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="py-10 md:py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <img 
          src={BRANDING_INFO.chatbot.avatar} 
          alt="HERE AND NOW AI Assistant" 
          className="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full mb-6 shadow-xl border-4"
          style={{ borderColor: BRANDING_INFO.colors.primary }}
        />
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          style={{ color: BRANDING_INFO.colors.secondary }}
        >
          Unlock Insights from Your Lease Agreements Instantly.
        </h1>
        <p 
          className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8"
        >
          AI Lease Analyzer, powered by HERE AND NOW AI, intelligently extracts key terms, dates, financial details, parties, clauses, and now offers risk scoring, AI summaries, and multi-language support. Streamline compliance, simplify management, and make informed decisions.
        </p>
        
        <button
          onClick={onGetStarted}
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ 
            backgroundColor: BRANDING_INFO.colors.primary, 
            color: BRANDING_INFO.colors.textOnPrimary,
            // @ts-ignore
            '--tw-ring-color': BRANDING_INFO.colors.secondary,
          }}
          aria-label="Analyze Your Lease Now"
        >
          <IconDocumentText className="w-6 h-6 mr-3" />
          Analyze Your Lease Now
          <IconArrowRight className="w-6 h-6 ml-3" />
        </button>
      </div>

      {/* What It Does Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <SectionTitle>What AI Lease Analyzer Does For You</SectionTitle>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border" style={{borderColor: `rgba(0, 64, 64, 0.1)`}}>
            <p className="text-lg text-gray-700 mb-6 text-center">
                AI Lease Analyzer revolutionizes how you interact with lease agreements. It intelligently extracts critical information, identifies potential risks, and provides actionable insights, all within seconds.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <FeatureListItem>Instant, accurate data extraction from lease documents.</FeatureListItem>
                <FeatureListItem>Automated risk assessment with clear justifications.</FeatureListItem>
                <FeatureListItem>AI-powered summaries for quick understanding.</FeatureListItem>
                <FeatureListItem>Multi-language support for diverse lease agreements.</FeatureListItem>
                <FeatureListItem>Secure and confidential document processing.</FeatureListItem>
                <FeatureListItem>Streamlined compliance and management workflows.</FeatureListItem>
            </ul>
        </div>
      </section>

      {/* Key Features / Benefits Section */}
      <section className="max-w-5xl mx-auto mb-16">
        <SectionTitle>Key Features & Benefits</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Comprehensive Data Extraction", description: "Automatically pulls key dates, rent amounts, parties involved, property details, and important clauses.", icon: IconDocumentText },
            { title: "Smart Clause Detection & Risk Scoring", description: "Identifies standard and critical clauses, flags missing ones, and assigns a color-coded risk score (Low, Moderate, High) with justifications.", icon: IconAlertTriangle },
            { title: "AI-Generated Summaries", description: "Get concise, easy-to-read summaries of complex lease documents instantly, highlighting crucial information.", icon: IconLightbulb },
            { title: "Policy Deviation Highlighting", description: "Flags terms that may differ from common lease standards, helping you spot unusual conditions. (Experimental)", icon: IconCheckCircle },
            { title: "AI Legal Assistant (In-Document)", description: "Ask specific questions about your analyzed lease and receive contextual answers based on its content.", icon: IconChat },
            { title: "Multi-Language Support", description: "Process leases in various languages including English, Hindi, Tamil, Spanish, French, and more.", icon: IconTranslateAlt }, 
            { title: "Secure & Confidential", description: "Your documents are processed securely using advanced AI, prioritizing your data privacy at every step.", icon: IconLock }, 
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition-shadow" style={{borderColor: `rgba(0, 64, 64, 0.1)`}}>
              <div className="flex items-center mb-3">
                {feature.icon ? <feature.icon className={`w-7 h-7 mr-3 text-[${BRANDING_INFO.colors.secondary}]`} /> : <IconCheckCircle className={`w-7 h-7 mr-3 text-[${BRANDING_INFO.colors.secondary}]`} />}
                <h3 className="text-lg font-semibold" style={{ color: BRANDING_INFO.colors.secondary }}>{feature.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <SectionTitle>Who Is It For?</SectionTitle>
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg border" style={{borderColor: `rgba(0, 64, 64, 0.1)`}}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <FeatureListItem>Property Managers & Landlords</FeatureListItem>
                <FeatureListItem>Real Estate Professionals & Agencies</FeatureListItem>
                <FeatureListItem>Legal Teams & Paralegals</FeatureListItem>
                <FeatureListItem>Corporate Legal Departments</FeatureListItem>
                <FeatureListItem>Small Business Owners managing leases</FeatureListItem>
                <FeatureListItem>Tenants & Leaseholders seeking clarity</FeatureListItem>
            </ul>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <SectionTitle>How It Works - Simple & Efficient</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { step: 1, title: "Upload Lease", description: "Securely upload your lease document (PDF, DOCX, TXT).", icon: IconUpload },
            { step: 2, title: "AI Analyzes", description: "Our advanced AI processes, extracts data, and assesses risks.", icon: IconLightbulb }, 
            { step: 3, title: "Review Insights", description: "View a structured report with key terms, summaries, and risk scores.", icon: IconDocumentText },
            { step: 4, title: "Act & Export", description: "Ask questions, add notes, and export your analysis (CSV, PDF summary).", icon: IconDownloadConstant },
          ].map((item) => (
            <div key={item.step} className="bg-white p-6 rounded-lg shadow-md border" style={{borderColor: `rgba(0, 64, 64, 0.1)`}}>
              <div 
                className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: BRANDING_INFO.colors.primary, color: BRANDING_INFO.colors.textOnPrimary }}
              >
                {item.icon ? <item.icon className="w-6 h-6"/> : item.step}
              </div>
              <h3 className="text-md font-semibold mb-1" style={{ color: BRANDING_INFO.colors.secondary }}>{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <p className="text-md text-gray-600 mt-10 italic">
          {BRANDING_INFO.slogan}
        </p>
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">
            <a href="#about" onClick={(e) => {e.preventDefault(); alert("About Us page placeholder.")}} className="hover:underline" style={{ color: BRANDING_INFO.colors.secondary }}>About Us</a>
          </p>
          <p>
            <a href="#privacy" onClick={(e) => {e.preventDefault(); alert("Privacy Policy / Terms page placeholder.")}}  className="hover:underline" style={{ color: BRANDING_INFO.colors.secondary }}>Privacy Policy / Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
