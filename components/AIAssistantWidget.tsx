import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BRANDING_INFO, IconChatBubble, IconSend, IconMicrophone, IconX } from '../constants';
import { ChatMessage } from '../types';

interface AIAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  apiKeyAvailable: boolean;
}

// Check for SpeechRecognition API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = false;
  recognition.interimResults = false; // Set to false to get final result only
  // recognition.lang = 'en-US'; // Can be set dynamically or based on browser
}

const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  isOpen,
  onToggle,
  messages,
  onSendMessage,
  isLoading,
  error,
  apiKeyAvailable
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading || !apiKeyAvailable) return;
    const messageToSend = inputValue;
    setInputValue('');
    await onSendMessage(messageToSend);
  };

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }
    if (!apiKeyAvailable) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
         console.error("Speech recognition start error:", err);
         alert("Could not start speech recognition. Please ensure microphone permission is granted and no other app is using the microphone.");
         setIsListening(false);
      }
    }
  };
  
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
      inputRef.current?.focus();
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        alert("Microphone access denied. Please allow microphone access in your browser settings to use voice input.");
      } else if (event.error === 'no-speech') {
        // alert("No speech detected. Please try again.");
      } else {
        // alert(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    }

    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        if(isListening) recognition.stop();
      }
    };
  }, [isListening]);


  return (
    <>
      <button
        id="ai-assistant-toggle-button" // Added ID for print CSS
        onClick={onToggle}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ 
          backgroundColor: BRANDING_INFO.colors.primary, 
          color: BRANDING_INFO.colors.textOnPrimary,
          // @ts-ignore
          '--tw-ring-color': BRANDING_INFO.colors.secondary
        }}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <IconX className="w-7 h-7" /> : <IconChatBubble className="w-7 h-7" />}
      </button>

      {isOpen && (
        <div 
            className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border"
            style={{ borderColor: BRANDING_INFO.colors.secondary }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-assistant-title"
        >
          <header 
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.primary }}
          >
            <h2 id="ai-assistant-title" className="text-lg font-semibold flex items-center">
              <img src={BRANDING_INFO.chatbot.face} alt="AI Assistant Face" className="w-8 h-8 rounded-full mr-2 border-2" style={{borderColor: BRANDING_INFO.colors.primary}}/>
              AI Assistant
            </h2>
            <button 
                onClick={onToggle} 
                aria-label="Close chat"
                className="p-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-1"
                style={{color: BRANDING_INFO.colors.primary, '--tw-ring-color': BRANDING_INFO.colors.primary} as React.CSSProperties}
            >
                <IconX className="w-5 h-5"/>
            </button>
          </header>

          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow ${
                    msg.sender === 'user'
                      ? 'bg-[--user-bg] text-[--user-text]'
                      : 'bg-gray-200 text-black' // AI messages: light gray background, black text
                  }`}
                  style={{
                    '--user-bg': BRANDING_INFO.colors.primary,
                    '--user-text': BRANDING_INFO.colors.textOnPrimary,
                  } as React.CSSProperties}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-right opacity-70' : 'text-left opacity-70'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg shadow bg-gray-200 text-black"> {/* Match AI bubble style */}
                  <p className="text-sm italic">AI is thinking...</p>
                </div>
              </div>
            )}
             {error && !isLoading && (
                 <div className="flex justify-start">
                    <div className="max-w-[75%] p-3 rounded-lg shadow bg-red-100 text-red-700 border border-red-300">
                        <p className="text-sm">Error: {error}</p>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {!apiKeyAvailable && (
             <div className="p-3 border-t text-xs text-center bg-red-50 text-red-600" style={{borderColor: BRANDING_INFO.colors.secondary}}>
                AI Assistant is unavailable. API Key not configured.
            </div>
          )}

          {apiKeyAvailable && (
            <form onSubmit={handleSubmit} className="p-3 border-t flex items-center gap-2" style={{borderColor: BRANDING_INFO.colors.secondary}}>
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={isListening ? "Listening..." : "Ask something..."}
                className="flex-grow p-2.5 border rounded-lg resize-none focus:ring-1 focus:outline-none text-sm"
                style={{borderColor: BRANDING_INFO.colors.secondary, '--tw-ring-color': BRANDING_INFO.colors.secondary} as React.CSSProperties}
                rows={1}
                disabled={isLoading || isListening || !apiKeyAvailable}
                aria-label="Chat message input"
              />
              {recognition && (
                <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isLoading || !apiKeyAvailable}
                    className={`p-2.5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 ${isListening ? 'bg-red-100 hover:bg-red-200' : 'hover:bg-gray-100'}`}
                    style={{color: isListening? BRANDING_INFO.colors.accent : BRANDING_INFO.colors.secondary, '--tw-ring-color': BRANDING_INFO.colors.secondary} as React.CSSProperties}
                    aria-label={isListening ? "Stop listening" : "Start listening"}
                >
                    <IconMicrophone className="w-5 h-5" isListening={isListening} />
                </button>
              )}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || isListening || !apiKeyAvailable}
                className="p-2.5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50"
                style={{backgroundColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.primary, '--tw-ring-color': BRANDING_INFO.colors.primary} as React.CSSProperties}
                aria-label="Send message"
              >
                <IconSend className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default AIAssistantWidget;