import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  File,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  MessageSquare
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DocumentCardProps {
  document: {
    id: number;
    originalName: string;
    fileType: string;
    fileSize: number;
    processingStatus: string;
    summary?: string;
    createdAt: string;
    updatedAt: string;
  };
  viewMode: "grid" | "list";
  onDelete: () => void;
}

export default function DocumentCard({ document, viewMode, onDelete }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const getFileIcon = (fileType: string) => {
    if (fileType === "application/pdf") {
      return <FileText className="w-5 h-5 text-red-500" />;
    } else if (fileType.includes("presentation") || fileType.includes("powerpoint")) {
      return <Presentation className="w-5 h-5 text-orange-500" />;
    } else if (fileType.includes("csv") || fileType.includes("excel") || fileType.includes("spreadsheet")) {
      return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
    } else {
      return <File className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Processed</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Processing</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Pending</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    setIsDeleting(true);
    try {
      await apiRequest("DELETE", `/api/documents/${document.id}`);
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
      onDelete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {getFileIcon(document.fileType)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-gray-900 truncate">{document.originalName}</h3>
                {getStatusBadge(document.processingStatus)}
              </div>
              <p className="text-sm text-gray-600 truncate">
                {document.summary || "No summary available"}
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 flex-shrink-0">
              <span>{formatFileSize(document.fileSize)}</span>
              <span>{formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}</span>
              
              <div className="flex items-center space-x-2">
                {document.processingStatus === "completed" && (
                  <Button size="sm" variant="default" className="bg-primary hover:bg-primary/90">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Query
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-material-lg transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              {getFileIcon(document.fileType)}
            </div>
            {getStatusBadge(document.processingStatus)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2 truncate">
          {document.originalName}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {document.summary || "No summary available"}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{formatFileSize(document.fileSize)}</span>
          <span>{formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {document.processingStatus === "completed" ? (
            <Button 
              size="sm" 
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Query
            </Button>
          ) : (
            <Button 
              size="sm" 
              disabled
              className="flex-1 bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              {document.processingStatus === "processing" ? "Processing..." : "Pending"}
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="px-2">
            <Eye className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="px-2">
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
