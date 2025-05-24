export const getFileTypeIcon = (fileType: string): string => {
  if (fileType === "application/pdf") {
    return "📄";
  } else if (fileType.includes("presentation") || fileType.includes("powerpoint")) {
    return "📊";
  } else if (fileType.includes("csv") || fileType.includes("excel") || fileType.includes("spreadsheet")) {
    return "📈";
  } else if (fileType.includes("word") || fileType === "text/plain") {
    return "📝";
  } else {
    return "📄";
  }
};

export const getFileTypeLabel = (fileType: string): string => {
  const typeMap: { [key: string]: string } = {
    "application/pdf": "PDF",
    "application/vnd.ms-powerpoint": "PowerPoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
    "text/csv": "CSV",
    "application/vnd.ms-excel": "Excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
    "application/msword": "Word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
    "text/plain": "Text"
  };
  
  return typeMap[fileType] || "Document";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const isProcessingComplete = (status: string): boolean => {
  return status === "completed";
};

export const canQueryDocument = (status: string): boolean => {
  return status === "completed";
};

export const getProcessingStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getProcessingStatusText = (status: string): string => {
  switch (status) {
    case "completed":
      return "Processed";
    case "processing":
      return "Processing";
    case "failed":
      return "Failed";
    default:
      return "Pending";
  }
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain"
  ];
  
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const getFileValidationError = (file: File): string | null => {
  if (!validateFileType(file)) {
    return "Unsupported file type. Please upload PDF, PowerPoint, CSV, Word, or text files.";
  }
  
  if (!validateFileSize(file)) {
    return "File too large. Maximum file size is 50MB.";
  }
  
  return null;
};
