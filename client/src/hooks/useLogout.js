import { useAuthContext } from "../hooks/useAuthContext.js"
import { useChat } from "./useChat.js";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { closeChat } = useChat();
  const logout = () => {
    closeChat();
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };
  return logout;
}
