import Contact from "../components/Contact.jsx"
export function Contacts({ conversations }) {
  return <div className="bl-1">
    {conversations.map(contact => <Contact key={contact._id} contact={contact} />)}
  </div>
}
