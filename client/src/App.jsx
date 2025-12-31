import { useAuthContext } from "./hooks/useAuthContext.js"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router'
import { NavBar } from "./components/NavBar.jsx"
import Home from "./pages/Home.jsx"
import Login from "./pages/login.jsx"
import Signup from "./pages/Signup.jsx"
import Profile from "./pages/Profile.jsx"

import EditProfile from "./pages/EditProfile.jsx"

import ChatWidget from "./components/ChatWidget.jsx"

function AppContent() {
  const { user } = useAuthContext();
  const location = useLocation();
  const hideNavbar = location.pathname === '/profile/editprofile';

  return (
    <>
      {!hideNavbar && <NavBar />}
      <div className="pages">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to='/login' />} />
          <Route path="/signup" element={!user? <Signup />: <Navigate to='/'/>} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to='/' />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to='/login' />} />
          <Route path="/profile/editprofile" element={user ? <EditProfile /> : <Navigate to='/login' />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
        <ChatWidget />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter >
      <AppContent />
    </BrowserRouter>
  )
}

export default App
