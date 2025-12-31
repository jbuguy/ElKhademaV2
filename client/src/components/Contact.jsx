import { useAuthContext } from "../hooks/useAuthContext"
import { useChat } from "../hooks/useChat";

export default function Contact({ contact }) {
  const { user } = useAuthContext();
  const { openChat } = useChat();

  const members = contact.members.filter((member) => user._id != member._id);
  return <div className="flex gap-4 items-center cursor-pointer" onClick={() => openChat({ _id: contact._id, displayName: members[0].displayName, displayPic: members[0].profilePic })}>
    <img src={members.length == 1 ? members[0].profilePic : ""} alt="" className="rounded-full h-10" />
    <span>{members.map((member) => member.username)}</span>
  </div>
}
