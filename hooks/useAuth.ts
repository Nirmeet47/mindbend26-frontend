"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    name?: string;
    email?: string;
  } | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      // Make a lightweight API call to check if user is authenticated
      // The server-side cookies will be sent automatically
      const response = await api.get("/users/profile");
      const user = response.data?.data?.user;
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: user ? { name: user.name, email: user.email } : null,
      });
    } catch (error: any) {
      // If 401 or any error, user is not authenticated
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const refreshAuth = useCallback(() => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    checkAuth();
  }, [checkAuth]);

  return {
    ...authState,
    refreshAuth,
  };
}

export default useAuth;
