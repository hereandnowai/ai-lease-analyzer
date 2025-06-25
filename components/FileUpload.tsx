
import React, { useState, useCallback, useRef } from 'react';
import { BRANDING_INFO, IconUpload, IconDocumentText, IconLightbulb } from '../constants';

interface FileUploadProps {
  onFileUpload: (files: FileList) => void; // Changed to FileList for multiple files
  isLoading: boolean;
  processedFileCount: number; // To show which file is being processed if we handle one by one later
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading, processedFileCount }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(event.target.files);
    } else {
      setSelectedFiles(null);
    }
  }, []);

  const handleDrag = useCallback((event: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFiles(event.dataTransfer.files);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedFiles && selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
    }
  }, [selectedFiles, onFileUpload]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const clearSelection = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setSelectedFiles(null);
    if(inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: BRANDING_INFO.colors.secondary }}>Upload Lease Document(s)</h2>
      
      <label
        htmlFor="file-upload-input"
        className={`flex flex-col items-center justify-center w-full min-h-[16rem] border-2 border-dashed rounded-lg cursor-pointer transition-colors
                    ${dragActive ? `border-[${BRANDING_INFO.colors.primary}] bg-[${BRANDING_INFO.colors.primary}] bg-opacity-10` : 'border-gray-300 hover:border-gray-400'}
                    ${selectedFiles && selectedFiles.length > 0 ? `border-[${BRANDING_INFO.colors.secondary}]` : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {selectedFiles && selectedFiles.length > 0 ? (
            <>
              <IconDocumentText className={`w-12 h-12 mb-3 text-[${BRANDING_INFO.colors.secondary}]`}/>
              {selectedFiles.length === 1 && selectedFiles[0] && (
                <>
                  <p className="mb-1 text-sm font-semibold" style={{ color: BRANDING_INFO.colors.secondary }}>{selectedFiles[0].name}</p>
                  <p className="text-xs text-gray-500">{(selectedFiles[0].size / 1024).toFixed(2)} KB</p>
                </>
              )}
              {selectedFiles.length > 1 && (
                <p className="mb-1 text-sm font-semibold" style={{ color: BRANDING_INFO.colors.secondary }}>{selectedFiles.length} files selected</p>
              )}
              <button 
                type="button"
                onClick={clearSelection} 
                className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
                aria-label="Clear selected files"
              >
                Clear selection
              </button>
            </>
          ) : (
            <>
              <IconUpload className="w-12 h-12 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold" style={{ color: BRANDING_INFO.colors.primary }}>Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOCX, TXT (Max 5MB per file)</p>
              <p className="text-xs text-gray-500 mt-1">Multiple files supported</p>
            </>
          )}
        </div>
        <input 
          id="file-upload-input" 
          ref={inputRef}
          type="file" 
          className="hidden" 
          onChange={handleFileChange} 
          accept=".pdf,.doc,.docx,.txt"
          multiple // Allow multiple file selection
        />
      </label>

      {selectedFiles && selectedFiles.length > 1 && (
        <div className="mt-3 p-3 rounded-md bg-blue-50 border border-blue-300 text-blue-700 text-sm flex items-start">
            <IconLightbulb className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-blue-500" />
            <span>
                <strong>Note:</strong> You've selected multiple files. Currently, the app will analyze the <strong>first file</strong> in the list. Full bulk processing is coming soon!
            </span>
        </div>
      )}

      { !process.env.API_KEY && (
         <p className="mt-4 text-sm text-center p-3 rounded-md bg-red-100 border border-red-300 text-red-700">
            <strong>Configuration Alert:</strong> The Gemini API key is not set. Please ensure the <code>process.env.API_KEY</code> environment variable is configured for the application to function.
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selectedFiles || selectedFiles.length === 0 || isLoading || !process.env.API_KEY}
        className="w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: BRANDING_INFO.colors.secondary, color: BRANDING_INFO.colors.primary }}
        aria-live="polite"
      >
        {isLoading ? (selectedFiles && selectedFiles.length > 1 ? `Analyzing file 1 of ${selectedFiles.length}...` : 'Analyzing Document...') : 'Analyze Lease Document(s)'}
      </button>
      <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
        <p>
          Supported formats: PDF, DOCX, TXT. Multi-language documents supported (English, Hindi, Tamil, etc.).
        </p>
        <p>
           For best results, ensure your document is clear and machine-readable. Analysis quality may vary. Your data is processed securely.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
