import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router";
import api from "../utils/api";
import { uploadMedia } from "../utils/uploadMedia";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const signup = async (email, password, role = "user", userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post("/user/signup", { email, password, role });
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch({ type: "LOGIN", payload: res.data });

      const payload = { ...userData };
      await api.put("/user/profile", payload, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Signup failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const signupCompany = async (email, password, role = "company", companyData) => {
    setIsLoading(true);
    setError(null);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }
      if (password.length < 8) {
        throw new Error("Security check: Password must be at least 8 characters");
      }
      if (companyData.companyName.trim().length < 2) {
        throw new Error("Company name must be at least 3 characters long");
      }
      if (companyData.founderName.trim().length < 3) {
        throw new Error("Founder name must be at least 3 characters long");
      }
      const selectedDate = new Date(companyData.foundedDate);
      const today = new Date();
      if (!companyData.foundedDate) {
        throw new Error("Foundation date is required");
      }
      if (selectedDate > today) {
        throw new Error("Foundation date cannot be in the future");
      }
      const desc = companyData.companyDescription.trim();
      if (desc.length < 50) {
        throw new Error(`Description too short (${desc.length}/50 min chars)`);
      }
      if (desc.length > 1000) {
        throw new Error("Description exceeds 1000 character limit");
      }
      if (!companyData.industry || companyData.industry === "") {
        throw new Error("Please select a valid industry sector");
      }
      if (!companyData.companySize || companyData.companySize === "") {
        throw new Error("Please specify your company size");
      }
      try {
        new URL(companyData.website);
      } catch (_) {
        throw new Error("Invalid Website URL. Make sure it starts with http:// or https://");
      }
      
      const res = await api.post("/user/signup", { email, password, role });
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch({ type: "LOGIN", payload: res.data });

      // uploading the profile picture and getting the cdn url
      const uploadResult = await uploadMedia(companyData.profilePic, "image");
      companyData.profilePic = uploadResult?.secure_url;

      // adding directly the data for the company
      const payload = { ...companyData };
      await api.put("/user/profile", payload, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || "Signup failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  return { signup,signupCompany, isLoading, error };
};
