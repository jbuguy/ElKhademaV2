import { useEffectEvent, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useChat } from "../hooks/useChat";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../utils/api";

export default function ChatWidget() {
  const { isOpen, activeChat, closeChat } = useChat();
  const [min, setMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuthContext();
  const [messages, setBody] = useState([]);

  const sendMessage = async () => {
    try {

      const res = await api.post(`conversation/${activeChat._id}/messages`, { content: message }, {
        headers: {
          authorization: `Bearer ${user.token}`
        }
      })
      setBody(prev => [...prev, res.data]);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;
  useEffectEvent(() => {
    try {

    } catch (error) {
      console.error(error);
    }
  }, [activeChat]);
  return (
    <div className="fixed bottom-0 right-4 w-80 max-h-96 shadow-xl flex flex-col z-50 rounded-t bg-gray-200">
      <div className="flex justify-between bg-green-700 p-2 text-white" onClick={() => setMinimized(false)}>
        <div className="flex gap-2 items-center">
          <img src={activeChat?.displayPic} alt="" className="rounded-full h-8" />
          <span>{activeChat?.displayName}</span>
        </div>
        <div className="flex gap-2">

          <button
            onClick={(e) => {
              e.preventDefault();
              setMinimized((prev) => !prev);
            }}
          >
            -
          </button>
          <button onClick={() => closeChat()}> x </button>
        </div>

      </div>
      {!min && (<>
        <div className="flex-grow h-80">{messages.map(m => m.content)}</div>
        <hr />
        <div className="flex p-2 gap-2">
          <textarea className="flex-grow border resize-none p-1" value={message} onChange={e => setMessage(e.target.value)} />
          <button onClick={sendMessage}> <IoMdSend /> </button>
        </div>
      </>)}
    </div>
  )
}
