"use client";
import { useState } from "react";
import Button from "../Button/page";
import Input from "../Input/page";
import axios from "axios";
import Cookies from "js-cookie";
import { Notyf } from "notyf";
import { useSearchParams } from "next/navigation";
import "notyf/notyf.min.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface FormData {
  firstname?: string;
  lastname?: string;
  email: string;
  password: string;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const notyf = new Notyf({
    duration: 3000,
    position: {
      x: "right",
      y: "top",
    },
    types: [
      {
        type: "success",
        background: "#10B981",
      },
      {
        type: "error",
        background: "#EF4444",
      },
    ],
  });

  const handleSuccessfulAuth = () => {
    const redirectPath = searchParams.get("redirect");

    // Close modal first
    onClose();

    if (redirectPath) {
      // Force navigation to the protected route using window.location
      window.location.href = redirectPath;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignIn) {
        // Login request
        const response = await axios.post(
          "https://zolo-production.up.railway.app/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        // Store user data and token in cookies
        Cookies.set("user", JSON.stringify(response.data.user), {
          expires: 30,
          secure: true,
          sameSite: "Lax",
        });
        Cookies.set("token", response.data.accessToken, {
          expires: 30,
          secure: true,
          sameSite: "Lax",
        });

        // Set token in axios defaults
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.accessToken}`;

        notyf.success("Logged in successfully");

        // Handle redirect after successful login
        handleSuccessfulAuth();

        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          password: "",
        });
      } else {
        // Register request
        await axios.post(
          "https://zolo-production.up.railway.app/api/auth/register",
          {
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
          }
        );

        setIsSignIn(true);
        notyf.success("Account created successfully. Please sign in.");
        setFormData((prev) => ({
          ...prev,
          firstname: "",
          lastname: "",
          email: "",
          password: "",
        }));
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorMessage =
        (err as AuthError).response?.data?.message ||
        "An error occurred. Please try again later.";
      setError(errorMessage);
      notyf.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-black">
          Welcome to Zillow
        </h2>

        <div className="flex mb-6 border-b">
          <button
            onClick={() => {
              setIsSignIn(true);
              setError("");
              setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
              });
            }}
            className={`pb-2 px-4 ${
              isSignIn ? "border-b-2 border-blue-600" : ""
            } text-gray-800`}
          >
            Sign in
          </button>
          <button
            onClick={() => {
              setIsSignIn(false);
              setError("");
              setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
              });
            }}
            className={`pb-2 px-4 ${
              !isSignIn ? "border-b-2 border-blue-600" : ""
            } text-gray-800`}
          >
            New account
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isSignIn && (
            <>
              <Input
                label="First name"
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                required
              />
              <Input
                label="Last name"
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
              />
            </>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={isSignIn ? "Enter password" : "At least 6 characters"}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span className="ml-2">Loading...</span>
              </div>
            ) : isSignIn ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </Button>

          {isSignIn && (
            <div className="text-center">
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Forgot your password?
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
