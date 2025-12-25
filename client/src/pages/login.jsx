import { useState } from "react"
import { useLogin } from "../hooks/useLogin";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email.password);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form className="login" onSubmit={handleSubmit}>
      <h3>Login</h3>
      <label >Email:</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <label >password:</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" disabled={isLoading}>Login</button>
      {error && (
        <div class="error">
          {error?.response.data?.error}
        </div>
      )}
    </form>
  )
}
