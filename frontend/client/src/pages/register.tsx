import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: "Registration successful" });
        navigate("/login");
      } else {
        toast({ title: "Registration failed", description: data.message || "Invalid data", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Registration failed", description: "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing up..." : "Register"}</Button>
        <div className="text-sm text-center mt-2">
          Already have an account? <a href="/login" className="text-primary underline">Sign In</a>
        </div>
      </form>
    </div>
  );
}
