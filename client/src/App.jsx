import { useAuthContext } from "./hooks/useAuthContext.js"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { NavBar } from "./components/NavBar.jsx"
import Home from "./pages/Home.jsx"
import Login from "./pages/login.jsx"
import Signup from "./pages/Signup.jsx"
import Profile from "./pages/Profile.jsx"
import ChatWidget from "./components/ChatWidget.jsx"

function App() {
  const { user } = useAuthContext();
  return (
    <BrowserRouter >
      <NavBar />
      <div className="pages">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to='/login' />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to='/' />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to='/' />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to='/login' />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>

      </div>
      <ChatWidget />
    </BrowserRouter>
  )
}

export default App
