import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, X, FileText, AlertCircle } from "lucide-react";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

export default function UploadModal({ open, onOpenChange, onUploadSuccess }: UploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: "pending" as const
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const uploadFile = files[i];
      
      if (uploadFile.status !== "pending") continue;

      try {
        // Update status to uploading
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: "uploading" as const } : f
        ));

        const formData = new FormData();
        formData.append("file", uploadFile.file);

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
          ));
        }, 200);

        const response = await apiRequest("POST", "/api/documents/upload", formData);
        
        clearInterval(progressInterval);

        // Complete the upload
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, progress: 100, status: "completed" as const } : f
        ));

        successCount++;
      } catch (error: any) {
        // Handle error
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            status: "error" as const, 
            error: error.message || "Upload failed" 
          } : f
        ));
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast({
        title: "Upload successful",
        description: `${successCount} file(s) uploaded successfully.`,
      });
      onUploadSuccess();
      
      // Close modal after a delay
      setTimeout(() => {
        setFiles([]);
        onOpenChange(false);
      }, 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "uploading":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "error":
        return "Failed";
      case "uploading":
        return "Uploading...";
      default:
        return "Pending";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? "border-primary bg-primary/5" 
                : "border-gray-300 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? "Drop files here" : "Choose files to upload"}
            </h4>
            <p className="text-gray-600 mb-4">or drag and drop them here</p>
            <Button type="button" variant="default">
              Browse Files
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              Supports PDF, PPT, CSV, DOC, TXT • Max 50MB per file
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {files.map((uploadFile, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {uploadFile.file.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {formatFileSize(uploadFile.file.size)}
                      </span>
                      {uploadFile.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {uploadFile.status === "uploading" && (
                    <Progress value={uploadFile.progress} className="mb-2" />
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${getStatusColor(uploadFile.status)}`}>
                      {uploadFile.error ? (
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{uploadFile.error}</span>
                        </div>
                      ) : (
                        getStatusText(uploadFile.status)
                      )}
                    </span>
                    {uploadFile.status === "uploading" && (
                      <span className="text-xs text-gray-500">
                        {uploadFile.progress}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={files.length === 0 || isUploading || files.every(f => f.status !== "pending")}
            >
              {isUploading ? "Uploading..." : "Upload Documents"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
