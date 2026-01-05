import { useEffect, useRef } from "react";
import api from "../utils/api";
import { useAuthContext } from "../hooks/useAuthContext";

export default function GoogleLoginButton({ onSuccess, onError }) {
  const divRef = useRef(null);
  const { dispatch } = useAuthContext();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setupButton = () => {
      if (!window.google || !divRef.current) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      // Render the default Google button
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
      });

      // Optional: automatically show the One Tap prompt
      // window.google.accounts.id.prompt();
    };

    // inject the Google Identity Services script if missing
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = setupButton;
      document.body.appendChild(script);
    } else {
      setupButton();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCredentialResponse = async (res) => {
    const idToken = res?.credential;
    if (!idToken) return onError?.(new Error("Missing credential"));

    try {
      const response = await api.post("/user/google", { idToken });
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch({ type: "LOGIN", payload: response.data });
      onSuccess?.(response.data);
    } catch (err) {
      console.error("Google login failed", err);
      onError?.(err);
    }
  };

  return <div ref={divRef} />;
}
