
import React from 'react';

export const BRANDING_INFO = {
  organizationShortName: "HERE AND NOW AI",
  organizationLongName: "HERE AND NOW AI - Artificial Intelligence Research Institute",
  website: "https://hereandnowai.com",
  email: "info@hereandnowai.com",
  mobile: "+91 996 296 1000",
  slogan: "designed with passion for innovation",
  colors: {
    primary: "#FFDF00", // Golden Yellow
    secondary: "#004040", // Dark Teal
    textOnPrimary: "#004040", // Dark Teal text on Golden Yellow background
    textOnSecondary: "#FFFFFF", // White text on Dark Teal background
    accent: "#E65100", // An orange accent for warnings or important actions
    riskLow: "#4CAF50", // Green
    riskModerate: "#FF9800", // Orange
    riskHigh: "#F44336", // Red
  },
  logo: {
    title: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png",
    favicon: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/favicon-logo-with-name.png"
  },
  chatbot: {
    avatar: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel.jpeg",
    face: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel-face.jpeg"
  },
  socialMedia: {
    blog: { url: "https://hereandnowai.com/blog", name: "Blog" },
    linkedin: { url: "https://www.linkedin.com/company/hereandnowai/", name: "LinkedIn" },
    instagram: { url: "https://instagram.com/hereandnow_ai", name: "Instagram" },
    github: { url: "https://github.com/hereandnowai", name: "GitHub" },
    x: { url: "https://x.com/hereandnow_ai", name: "X" },
    youtube: { url: "https://youtube.com/@hereandnow_ai", name: "YouTube" }
  }
};

export const GEMINI_API_MODEL = "gemini-2.5-flash-preview-04-17";

// SVG Icons
export const IconBlog: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 3H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h7v3H8v2h8v-2h-3v-3h7c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 15V5h16l.001 10H4z"/><path d="M6 7h8v2H6zm0 4h8v2H6z"/></svg>
);
export const IconLinkedIn: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065s.919-2.065 2.063-2.065 2.064.926 2.064 2.065-.92 2.065-2.064 2.065zm1.776 13.019H3.561V9h3.552v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
);
export const IconInstagram: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.272.058 2.15.228 2.913.512.783.295 1.445.678 2.13 1.365.683.686 1.07 1.348 1.364 2.131.284.763.454 1.64.512 2.913.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.058 1.272-.228 2.15-.512 2.913-.295.783-.678 1.445-1.365 2.13-.686.683-1.348 1.07-2.131 1.364-.763.284-1.64.454-2.913.512-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.272-.058-2.15-.228-2.913-.512-.783-.295-1.445-.678-2.13-1.365-.683-.686-1.07-1.348-1.364-2.131-.284-.763-.454-1.64-.512-2.913-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.058-1.272.228-2.15.512-2.913.295-.783.678-1.445 1.365-2.13.686-.683 1.348 1.07 2.131-1.364.763-.284 1.64-.454 2.913-.512C8.416 2.175 8.796 2.163 12 2.163zm0 1.802c-3.15 0-3.497.01-4.722.066-.99.045-1.631.2-2.113.385-.504.19-.9.42-1.296.815-.395.396-.625.792-.815 1.296-.185.482-.34 1.123-.385 2.113C2.625 8.503 2.615 8.85 2.615 12s.01 3.497.066 4.722c.045.99.2 1.631.385 2.113.19.504.42.9.815 1.296.396.395.792.625 1.296.815.482.185 1.123.34 2.113.385C8.503 21.375 8.85 21.385 12 21.385s3.497-.01 4.722-.066c.99-.045 1.631-.2 2.113-.385.504-.19.9-.42 1.296-.815.395-.396.625-.792.815-1.296.185-.482.34-1.123.385-2.113.056-1.225.066-1.572.066-4.722s-.01-3.497-.066-4.722c-.045-.99-.2-1.631-.385-2.113-.19-.504-.42-.9-.815-1.296-.396-.395-.792-.625-1.296-.815-.482-.185-1.123.34-2.113-.385C15.497 3.975 15.15 3.965 12 3.965z"/><path d="M12 6.865A5.135 5.135 0 1012 17.135 5.135 5.135 0 0012 6.865zm0 8.468A3.333 3.333 0 1112 8.667a3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z"/></svg>
);
export const IconGitHub: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
);
export const IconX: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25h6.088l4.287 5.83L18.244 2.25zm-1.56 17.52h2.454L6.156 4.02H3.58l13.104 15.75z"/></svg>
);
export const IconYouTube: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

export const IconUpload: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
  </svg>
);

export const IconDownload: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const IconDocumentText: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const IconAlertTriangle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const IconCheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const IconArrowRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export const IconPDF: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h4.5m-4.5 0H5.625c-.621 0-1.125.504-1.125-1.125V11.25m0-4.5V6.75c0-.621.504-1.125 1.125-1.125h3.375c.621 0 1.125.504 1.125 1.125v1.5m0 12.75v-1.5m0 0H21m-6.75 0h1.5m-1.5 0H12m0 0h-1.5m2.25-4.5H12m0 0h-1.5m3.75 0H12m0 0h-1.5m9-3.75H12m0 0H8.25m5.25 0H12m0 0h-1.5M12 9.75V6.75m0 0H8.25m11.25 0h-2.25M3.75 15V6.75c0-1.108.892-2 2-2h12.5c1.108 0 2 .892 2 2v8.25c0 1.108-.892 2-2 2H5.75c-1.108 0-2-.892-2-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 16.5V15h4.5v1.5m-4.5 0h4.5m-4.5-1.5h.008v.008H9.75V15zm.75-3h3M10.5 9h3m-3 1.5h3" />
 </svg>
);

export const IconEmail: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const IconChat: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.158 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l3.663-4.332c.26-.39.687-.634 1.153-.671.97-.085 2.047-.207 3.125-.372 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

export const IconLightbulb: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 21.75h4.5" />
  </svg>
);

export const IconMicrophone: React.FC<{ className?: string; isListening?: boolean }> = ({ className, isListening }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={isListening ? BRANDING_INFO.colors.accent : "currentColor"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c-1.125 0-2.25-.45-3.037-1.237A4.5 4.5 0 016.75 9.75V6.75a5.25 5.25 0 0110.5 0v3a4.5 4.5 0 01-2.213 3.963A6.002 6.002 0 0112 15z" />
  </svg>
);

export const IconSend: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export const IconChatBubble: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.25V6.75c0-1.06-.84-1.912-1.897-1.912H5.647C4.59 4.838 3.75 5.688 3.75 6.75v6.262c0 .63.356 1.196.906 1.485l5.249 2.625c.37.185.82.185 1.19 0l5.249-2.625c.55-.289.906-.855.906-1.485V12.75a.75.75 0 00-1.5 0v1.363l-4.125 2.062a.75.75 0 01-.595 0L6 14.113V8.25c0-.207.168-.375.375-.375h12.375c.207 0 .375.168.375.375v.001z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5" />
  </svg>
);

// New Placeholder Icons for HomePage features - replace with actual SVGs or refine
export const IconTranslateAlt: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 6.018 13.873 6.341 14.625 6.75m0 0l3.056 2.038m-3.056-2.038a48.549 48.549 0 01-2.43 4.085M14.625 6.75c-.869.298-1.713.54-2.553.742m2.553-.742a26.012 26.012 0 00-4.086 5.834M9 14.25L3 14.25M9 14.25a26.012 26.012 0 01-4.085-5.833M9 14.25V21" />
  </svg>
);
export const IconLock: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
