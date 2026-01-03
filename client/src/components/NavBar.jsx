import { Link } from "react-router";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useLogout } from "../hooks/useLogout.js";
import { useState, useEffect } from "react";
import api from "../utils/api.js";

export function NavBar() {
    const logout = useLogout();
    const { user } = useAuthContext();
    const [displayName, setDisplayName] = useState("");
    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user.username) {
                try {
                    const res = await api.get(`/user/profile/${user.username}`);
                    const profile = res.data.profile;
                    // Get display name based on profile type
                    let name = "";
                    if (profile.profileType === "company") {
                        name = profile.companyName || "";
                    } else {
                        name = `${profile.firstName || ""} ${
                            profile.lastName || ""
                        }`.trim();
                    }
                    setDisplayName(name);
                    setProfilePic(res.data.user.profilePic || "");
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }
        };
        fetchProfile();
    }, [user]);

    const handleClick = () => {
        logout();
    };
    return (
        <header>
            <div className="container">
                <Link to="/">
                    <h1>ElKadema</h1>
                </Link>
                <nav>
                    {user ? (
                        <div>
                            <Link to="/jobs" className="cursor-pointer">
                                Jobs
                            </Link>
                            <Link to="/messages" className="cursor-pointer">
                                messages
                            </Link>
                            <Link to="/profile">
                                <img
                                    src={
                                        profilePic ||
                                        user.profilePic ||
                                        "https://via.placeholder.com/40"
                                    }
                                    alt="profile"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                        cursor: "pointer",
                                    }}
                                />
                            </Link>
                            <Link
                                to="/profile"
                                style={{
                                    textDecoration: "none",
                                    color: "#333",
                                }}
                            >
                                <span className="cursor-pointer">
                                    {displayName || user.username || user.email}
                                </span>
                            </Link>
                            <button onClick={handleClick}>logout</button>
                        </div>
                    ) : (
                        <div>
                            <Link to={"/login"}>Login</Link>
                            <Link to={"/signup"}>Sign up</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
