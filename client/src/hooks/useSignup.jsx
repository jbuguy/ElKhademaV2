import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import api from "../utils/api";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/user/signup", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch({ type: "LOGIN", payload: res.data });
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};
