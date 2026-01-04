import { useState } from "react"
import { useLogin } from "../hooks/useLogin";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-12">
      <form className="login bg-white p-6 rounded shadow" onSubmit={handleSubmit}>
        <h3 className="text-xl font-semibold mb-4">Login</h3>
        <label >Email:</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label >password:</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" disabled={isLoading}>Login</button>
        {error && (
          <div className="error">
            {error?.response.data?.error}
          </div>
        )}
      </form>

      <div className="mt-6 flex items-center justify-center">
        <div className="text-sm text-gray-500 mr-4">Or sign in with</div>
        <GoogleLoginButton />
      </div>
    </div>
  )
}
