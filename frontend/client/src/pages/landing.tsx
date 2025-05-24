import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, MessageSquare, Search, Shield, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Landing() {
  const [, navigate] = useLocation();

  const handleRegister = () => {
    navigate("/register");
  };
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-secondary-900">DocuQuery</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
                Login
              </Button>
              <Button onClick={handleRegister} className="bg-green-600 hover:bg-green-700">
                Register
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Intelligent Document
            <span className="text-primary"> Management</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Upload, store, and interact with your documents using advanced AI. 
            Ask questions about your files and get instant, context-aware answers.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={handleRegister}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
            >
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Multi-Format Support</CardTitle>
              <CardDescription>
                Upload PDFs, PowerPoint presentations, CSV files, Word documents, and more. 
                Our system handles all major document formats.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg font-semibold">AI-Powered Queries</CardTitle>
              <CardDescription>
                Ask natural language questions about your documents and get intelligent, 
                context-aware answers powered by advanced AI.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Smart Search</CardTitle>
              <CardDescription>
                Find information across all your documents instantly. Our semantic search 
                understands context, not just keywords.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Secure & Private</CardTitle>
              <CardDescription>
                Your documents are securely stored and processed. We prioritize privacy 
                and data protection in everything we do.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Lightning Fast</CardTitle>
              <CardDescription>
                Get answers to your questions in seconds. Our optimized processing 
                ensures quick responses without compromising accuracy.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle className="text-lg font-semibold">Document Management</CardTitle>
              <CardDescription>
                Organize, categorize, and manage your documents with an intuitive interface. 
                Keep track of processing status and metadata.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to transform your document workflow?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of users who are already saving time with intelligent document management.
          </p>
          <Button 
            onClick={handleRegister}
            size="lg"
            className="mt-8 bg-primary hover:bg-primary/90 text-white px-12 py-4"
          >
            Start Now - It's Free
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-600">
              © 2024 DocuQuery. Intelligent document management powered by AI.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
