import { useState } from "react"
import { useAuthContext } from "../hooks/useAuthContext.js";
import api from "../utils/api.js"

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch({ type: "LOGIN", payload: res.data });
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }
  return { login, isLoading, error };
}
