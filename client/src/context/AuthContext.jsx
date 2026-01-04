import { createContext, useEffect, useReducer } from "react";

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, user: action.payload };
        case "LOGOUT":
            return { ...state, user: null };
        case "AUTH_IS_READY":
            return { user: action.payload, authIsReady: true };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false,
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        dispatch({ type: "AUTH_IS_READY", payload: user });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
