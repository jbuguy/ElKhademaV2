
import { useState } from "react"
import { useSignup } from "../hooks/useSignup";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const { signup, isLoading, error } = useSignup();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, role);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>create an account</h3>
      <label >Email:</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <label >password:</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      
      <label>Account Type:</label>
      <div style={{ display: 'flex', gap: '20px', margin: '10px 0' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input 
            type="radio" 
            value="user" 
            checked={role === "user"} 
            onChange={e => setRole(e.target.value)}
          />
          User
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input 
            type="radio" 
            value="company" 
            checked={role === "company"} 
            onChange={e => setRole(e.target.value)}
          />
          Company
        </label>
      </div>
      
      <button type="submit" disabled={isLoading}>sign up</button>
      {error && (
        <div className="error">
          {error?.response.data?.error}
        </div>
      )}
    </form>
  )
}
