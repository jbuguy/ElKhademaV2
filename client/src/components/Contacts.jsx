import Contact from "../components/Contact.jsx";
export function Contacts({ conversations }) {
    return (
        <div className="flex flex-col divide-y divide-gray-100">
            {conversations.map((contact) => (
                <Contact key={contact._id} contact={contact} />
            ))}
        </div>
    );
}
