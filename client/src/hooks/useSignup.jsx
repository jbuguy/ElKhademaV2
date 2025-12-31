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
  const signupCompany = async (email, password, role = "company",companyData) => {
    setIsLoading(true);
    console.log("saye")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {setIsLoading(false);throw new Error("Invalid email format");}
    if (password.length < 8) {setIsLoading(false);throw new Error("Security check: Password must be at least 8 characters");}
    if (companyData.companyName.trim().length < 2) {
            setIsLoading(false);
            throw new Error("Company name must be at least 3 characters long");
    }
    if (companyData.founderName.trim().length < 3) {
      setIsLoading(false);
      throw new Error("Founder name must be at least 3 characters long");
    }
    const selectedDate = new Date(companyData.foundedDate);
    const today = new Date();
    if (!companyData.foundedDate) {setIsLoading(false);throw new Error("Foundation date is required");}
    if (selectedDate > today) {setIsLoading(false);throw new Error("Foundation date cannot be in the future");}
    const desc = companyData.companyDescription.trim();
    if (desc.length < 50) {setIsLoading(false);throw new Error(`Description too short (${desc.length}/50 min chars)`);}
    if (desc.length > 1000) {setIsLoading(false);throw new Error("Description exceeds 1000 character limit");      }
    if (!companyData.industry || companyData.industry === "") {
      setIsLoading(false);
      throw new Error("Please select a valid industry sector");
    }
    if (!companyData.companySize || companyData.companySize === "") {
      setIsLoading(false);
      throw new Error("Please specify your company size");
    }
    try {
      new URL(companyData.website); 
    // eslint-disable-next-line no-unused-vars
    } catch (_) {
      setIsLoading(false);
      throw new Error("Invalid Website URL. Make sure it starts with http:// or https://");
    }
    const res = await api.post("/user/signup", { email, password, role });
    console.log("data:",res.data)
    localStorage.setItem("user", JSON.stringify(res.data));
    dispatch({ type: "LOGIN", payload: res.data });

    // adding directly the data for the company
    companyData._id = res.data._id;
    await api.post("/profile", companyData)
    setIsLoading(false);
    navigate("/", { replace: true });


  };
  return { signup,signupCompany, isLoading, error };
};
