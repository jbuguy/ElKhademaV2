import { useAuthContext } from "./hooks/useAuthContext.js"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { NavBar } from "./components/NavBar.jsx"
import Home from "./pages/Home.jsx"
import Login from "./pages/login.jsx"

function App() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter >
      <NavBar />
      <div className="pages">
        <Routes>
          <Route path="/" element={!user ? <Home /> : <Navigate to='/' />} />
          <Route path="/signup" element={!user ? <Login /> : <Navigate to='/' />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to='/' />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App
