'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileProcessed: (data: any, file?: File) => void;
  uploadType: 'quotation' | 'invoice';
  accept?: Record<string, string[]>;
}

export default function FileUpload({ onFileProcessed, uploadType, accept }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const defaultAccept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp']
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);
    setUploadStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = uploadType === 'quotation' ? '/api/extract-quotation' : '/api/extract-invoice';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus('success');
        toast.success(`${uploadType === 'quotation' ? 'Quotation' : 'Invoice'} data extracted successfully!`);
        onFileProcessed(result.data, file);
      } else {
        setUploadStatus('error');
        toast.error(result.error || 'Failed to process file');
      }
    } catch (error) {
      setUploadStatus('error');
      toast.error('An error occurred while processing the file');
      console.error('File upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [uploadType, onFileProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || defaultAccept,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Upload className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing file...';
      case 'success':
        return 'File processed successfully!';
      case 'error':
        return 'Failed to process file';
      default:
        return 'Drop your file here or click to upload';
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50';
      case 'success':
        return 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50';
      case 'error':
        return 'border-red-400 bg-gradient-to-r from-red-50 to-rose-50';
      default:
        return isDragActive 
          ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-indigo-100' 
          : 'border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <span className="font-semibold text-gray-800">📁 Supported formats:</span> PDF, Word documents (.doc, .docx), Images (.jpg, .png, .webp)
          <br />
          <span className="font-semibold text-gray-800">📏 Maximum file size:</span> 10MB
        </p>
      </div>

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-3 border-dashed rounded-2xl p-10 text-center
            ${getStatusColor()}
            ${isUploading 
              ? 'cursor-not-allowed opacity-60' 
              : 'cursor-pointer hover:shadow-lg transition-shadow duration-200'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${
              uploadStatus === 'uploading' ? 'bg-blue-100' :
              uploadStatus === 'success' ? 'bg-green-100' :
              uploadStatus === 'error' ? 'bg-red-100' :
              'bg-gray-100'
            }`}>
              {getStatusIcon()}
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {getStatusMessage()}
              </p>
              {uploadStatus === 'idle' && (
                <p className="text-sm text-gray-600 mt-2">
                  Drag & drop your file here, or <span className="text-orange-600 font-medium">browse</span> to select
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={`border-2 rounded-xl p-6 shadow-sm ${getStatusColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <File className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{uploadedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {getStatusIcon()}
              </div>
              {uploadStatus !== 'uploading' && (
                <button
                  onClick={removeFile}
                  className="p-2 hover:bg-white/80 rounded-lg transition-all duration-200 hover:scale-110 shadow-sm"
                  disabled={isUploading}
                  title="Remove file"
                  aria-label="Remove uploaded file"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
          {uploadStatus !== 'idle' && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-800">{getStatusMessage()}</p>
            </div>
          )}
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Success!</p>
              <p className="text-sm text-green-700">
                Data has been extracted and populated in the form fields below. Please review and edit as needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 p-2 rounded-full">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-800">Upload Failed</p>
              <p className="text-sm text-red-700">
                Failed to extract data from the file. Please try again or fill the form manually.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
