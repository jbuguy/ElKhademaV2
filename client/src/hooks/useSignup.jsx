import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router";
import api from "../utils/api";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const signup = async (email, password, role = "user") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/user/signup", { email, password, role });
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch({ type: "LOGIN", payload: res.data });
      // Redirect to profile edit page
      navigate("/profile/editprofile", { replace: true });
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};
