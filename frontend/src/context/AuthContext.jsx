import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUser(res.data);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  const loginWithGoogle = async (tokenFromGoogle) => {
  const res = await axios.post(`${API_URL}/auth/google`, {
    token: tokenFromGoogle,
  });

  localStorage.setItem("token", res.data.token);
  setToken(res.data.token);
  setUser(res.data.user);

  return res.data.user;
};

  // Register
  const register = async (name, email, password, role) => {
    await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      role,
    });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
  value={{
    user,
    token,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,   
  }}
>
      {children}
    </AuthContext.Provider>
  );
};