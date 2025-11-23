import React, { useState } from "react";
import AuthContext from "./createAuthContext";

// Initialize user from localStorage
const initializeUser = () => {
  const storedUser = localStorage.getItem("ecommerce_user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem("ecommerce_user");
    }
  }
  return null;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(initializeUser);

  // Simulate user database (in real app, this would be backend API)
  const getUserDatabase = () => {
    const stored = localStorage.getItem("ecommerce_users_db");
    return stored ? JSON.parse(stored) : [];
  };

  const saveUserDatabase = (users) => {
    localStorage.setItem("ecommerce_users_db", JSON.stringify(users));
  };

  const register = (name, email, password) => {
    // Validation
    if (!name || !email || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }

    if (password.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Email inválido");
    }

    const users = getUserDatabase();
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      throw new Error("Este email já está cadastrado");
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: btoa(password), // Simple base64 encoding (NOT SECURE - only for demo)
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUserDatabase(users);

    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("ecommerce_user", JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const login = (email, password) => {
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const users = getUserDatabase();
    const foundUser = users.find(u => u.email === email);

    if (!foundUser || btoa(password) !== foundUser.password) {
      throw new Error("Email ou senha incorretos");
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem("ecommerce_user", JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecommerce_user");
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    register,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
