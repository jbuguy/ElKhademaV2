
import { useState } from "react"
import { useSignup } from "../hooks/useSignup";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignup();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
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
      <button type="submit" disabled={isLoading}>sign up</button>
      {error && (
        <div className="error">
          {error?.response.data?.error}
        </div>
      )}
    </form>
  )
}
