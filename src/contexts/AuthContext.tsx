"use client";

import { UserProfile } from "@/lib/types";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

interface AuthContextType {
  accessToken: string | null;
  userProfile: UserProfile | null;
  login: (token: string, profile: UserProfile) => void;
  logout: () => void;
  isLoading: boolean;
  isNewLogin: boolean;
  setIsNewLogin: (isNew: boolean) => void;
  updateProfile: (profile: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewLogin, setIsNewLogin] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return;

    try {
      const storedToken = localStorage.getItem("accessToken");
      const storedProfileJSON = localStorage.getItem("userProfile");

      if (storedToken && storedProfileJSON) {
        const storedProfile: UserProfile = JSON.parse(storedProfileJSON);
        setAccessToken(storedToken);
        setUserProfile(storedProfile);
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      toast.error("Could not restore your session. Please log in again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userProfile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string, profile: UserProfile) => {
    if (typeof window === "undefined") return;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setAccessToken(token);
    setUserProfile(profile);
    setIsNewLogin(true);
  };

  const logout = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userProfile");
    setAccessToken(null);
    setUserProfile(null);
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  const updateProfile = (profile: UserProfile) => {
    if (typeof window === "undefined") return;

    setUserProfile(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userProfile,
        login,
        logout,
        isLoading,
        isNewLogin,
        setIsNewLogin,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
