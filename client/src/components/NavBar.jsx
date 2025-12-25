import { Link } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useLogout } from "../hooks/useLogout.js"

export function NavBar() {
  const logout = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    logout();
  };
  return (
    <header>
      <div class="container">
        <Link to="/">
          <h1>ElKadema</h1>
        </Link>
        <nav>
          {user ? (
            <div>
              <span>{user.username}</span>
              <button onClick={handleClick}>logout</button>
            </div>) : (
            <div>
              <Link to={"/login"}>Login</Link>
              <Link to={"/signup"}>Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
