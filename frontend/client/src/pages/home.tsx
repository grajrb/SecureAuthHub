import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import DocumentCard from "@/components/document-card";
import RAGPanel from "@/components/rag-panel";
import UploadModal from "@/components/upload-modal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Grid3X3, List, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: number;
  originalName: string;
  fileType: string;
  fileSize: number;
  processingStatus: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  const { data: documents = [], isLoading, refetch } = useQuery<Document[]>({
    queryKey: ["/api/documents", selectedType],
    refetchInterval: 2000, // Poll for status updates
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/documents/stats"]
  });

  const handleUploadSuccess = () => {
    toast({
      title: "Upload successful",
      description: "Your document is being processed.",
    });
    refetch();
  };

  const filteredDocuments = documents.filter(doc => {
    if (selectedType === "all") return true;
    
    const typeMap: { [key: string]: string[] } = {
      pdf: ["application/pdf"],
      powerpoint: [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ],
      spreadsheet: [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ],
      document: [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain"
      ]
    };

    return typeMap[selectedType]?.includes(doc.fileType) || false;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.originalName.localeCompare(b.originalName);
      case "size":
        return b.fileSize - a.fileSize;
      case "modified":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default: // recent
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar 
          stats={stats}
          onUploadClick={() => setUploadModalOpen(true)}
        />

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Documents Panel */}
            <div className="flex-1 flex flex-col">
              {/* Documents Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage and query your uploaded documents
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="powerpoint">PowerPoint</SelectItem>
                        <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Recently Added</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                        <SelectItem value="size">Size</SelectItem>
                        <SelectItem value="modified">Modified Date</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex border border-gray-300 rounded-lg">
                      <Button 
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none border-l"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Upload Drop Zone */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => setUploadModalOpen(true)}
                >
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Drag & drop files here
                  </h3>
                  <p className="text-gray-600 mb-4">or click to browse</p>
                  <p className="text-sm text-gray-500">
                    Supports PDF, PPT, CSV, DOC, TXT files up to 50MB
                  </p>
                </div>

                {/* Documents Grid/List */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading documents...</p>
                  </div>
                ) : sortedDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No documents found. Upload your first document to get started!</p>
                  </div>
                ) : (
                  <div className={viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                  }>
                    {sortedDocuments.map((document) => (
                      <DocumentCard 
                        key={document.id}
                        document={document}
                        viewMode={viewMode}
                        onDelete={refetch}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RAG Panel */}
            <RAGPanel />
          </div>
        </main>
      </div>

      <UploadModal 
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
