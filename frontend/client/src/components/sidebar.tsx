import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  FolderOpen, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  File,
  Search,
  Plus
} from "lucide-react";

interface SidebarProps {
  stats?: {
    total: number;
    pdf: number;
    powerpoint: number;
    spreadsheet: number;
    document: number;
  };
  onUploadClick: () => void;
}

export default function Sidebar({ stats, onUploadClick }: SidebarProps) {
  const { data: recentQueries = [] } = useQuery<string[]>({
    queryKey: ["/api/chat/recent-queries"]
  });

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden lg:block">
      <div className="p-6">
        <Button 
          onClick={onUploadClick}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </Button>
      </div>
      
      <nav className="px-6 pb-6">
        <div className="space-y-1">
          <a 
            href="#" 
            className="bg-blue-50 text-blue-600 group flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          >
            <FolderOpen className="w-4 h-4 text-blue-500 mr-3" />
            All Documents
            <span className="ml-auto bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
              {stats?.total || 0}
            </span>
          </a>
          
          <a 
            href="#" 
            className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          >
            <FileText className="w-4 h-4 text-red-500 mr-3" />
            PDFs
            <span className="ml-auto text-gray-500 text-xs">
              {stats?.pdf || 0}
            </span>
          </a>
          
          <a 
            href="#" 
            className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          >
            <Presentation className="w-4 h-4 text-orange-500 mr-3" />
            Presentations
            <span className="ml-auto text-gray-500 text-xs">
              {stats?.powerpoint || 0}
            </span>
          </a>
          
          <a 
            href="#" 
            className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-500 mr-3" />
            Spreadsheets
            <span className="ml-auto text-gray-500 text-xs">
              {stats?.spreadsheet || 0}
            </span>
          </a>
          
          <a 
            href="#" 
            className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          >
            <File className="w-4 h-4 text-blue-500 mr-3" />
            Text Documents
            <span className="ml-auto text-gray-500 text-xs">
              {stats?.document || 0}
            </span>
          </a>
        </div>
        
        {recentQueries.length > 0 && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Recent Queries
            </h3>
            <div className="mt-3 space-y-1">
              {recentQueries.slice(0, 3).map((query, index) => (
                <a 
                  key={index}
                  href="#"
                  className="text-gray-700 hover:bg-gray-50 group flex items-center px-3 py-2 text-sm rounded-lg"
                  onClick={e => {
                    e.preventDefault();
                    // Redirect to / (home) and open the AI assistant with the query pre-filled
                    if (typeof window !== 'undefined') {
                      // Use a custom event to communicate with RAGPanel
                      window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: { query } }));
                    }
                  }}
                >
                  <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="truncate">{query}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
