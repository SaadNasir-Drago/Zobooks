"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // <-- Import toast hook

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // For error handling

  // Get the toast function
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error state before the new attempt

    try {
      const response = await fetch("https://disturbed-devan-saadnasir-602e9ad5.koyeb.app/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        // For a non-2xx response, we throw an error.
        throw new Error("Login failed");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/"); // Redirect after login
      } else {
        // If the server doesn't return a token, treat as failure:
        throw new Error("Token not received");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid email or password.");

      // Show a toast for wrong password or any login error
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive", // or "default" / "warning" / etc., depending on your theming
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="mb-6 text-3xl font-bold text-center">Login</h1>
        {error && <p className="text-red-500">{error}</p>}{" "}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <Button
          variant="link"
          className="mt-4 w-full"
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
