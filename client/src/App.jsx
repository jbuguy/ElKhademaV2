import { useAuthContext } from "./hooks/useAuthContext.js";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router";
import { NavBar } from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Jobs from "./pages/jobs.jsx";
import PostView from "./pages/PostView.jsx";
import MessagePage from "./pages/messages.jsx";
import JobCreation from "./pages/jobCreation.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import JobView from "./pages/JobView.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import ChatWidget from "./components/ChatWidget.jsx";

function AppContent() {
    const { user, authIsReady } = useAuthContext();
    const location = useLocation();
    const hideNavbar = location.pathname === "/profile/editprofile";
    if (!authIsReady) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="text-xl font-bold text-primary-600">
                    <h1>Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <>
            {!hideNavbar && <NavBar />}
            <div className="page-container">
                <Routes>
                    <Route
                        path="/"
                        element={user ? <Home /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/signup"
                        element={!user ? <Signup /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/login"
                        element={!user ? <Login /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/profile"
                        element={user ? <Profile /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/profile/editprofile"
                        element={
                            user ? <EditProfile /> : <Navigate to="/login" />
                        }
                    />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route
                        path="/post/:id"
                        element={user ? <PostView /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/jobs"
                        element={user ? <Jobs /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/messages"
                        element={
                            user ? <MessagePage /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/messages/:conversationId"
                        element={
                            user ? <MessagePage /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/jobs/form"
                        element={
                            user ? (
                                user.role === "company" ? (
                                    <JobCreation />
                                ) : (
                                    <Navigate to="/jobs" />
                                )
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/jobs/:jobId"
                        element={user ? <JobView /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/admin"
                        element={
                            user ? (
                                user.role === "admin" ? (
                                    <AdminDashboard />
                                ) : (
                                    <Navigate to="/" />
                                )
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
                <ChatWidget />
            </div>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
