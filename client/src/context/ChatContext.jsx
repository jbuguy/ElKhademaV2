import { createContext, useState } from "react";
const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const openChat = (chat) => {
    setActiveChat(chat);
    setIsOpen(true);
  }
  const closeChat = () => {
    setActiveChat(null);
    setIsOpen(false);
  }
  return <ChatContext.Provider value={{ isOpen, activeChat, openChat, closeChat }}>
    {children}
  </ChatContext.Provider>
}
export default ChatContext;
