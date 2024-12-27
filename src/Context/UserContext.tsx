import React, { createContext, useContext, useEffect, useReducer } from "react";

interface User {
    username: string;
}

interface State {
    user: User | null;
    loading: boolean;
    error: null | string;
}

const initialState: State = {
    user: null,
    loading: false,
    error: null,
};

// Define Action Types
type Action =
    | { type: "START_FETCH_USER_DATA" }
    | { type: "FETCH_USER_DATA_SUCCESS"; payload: User }
    | { type: "FETCH_USER_DATA_ERROR"; payload: string }
    | {type: "LOGOUT"}

// Reducer Function
const userReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "START_FETCH_USER_DATA":
            return { ...state, loading: true, error: null };
        case "FETCH_USER_DATA_SUCCESS":
            return { ...state, user: action.payload, loading: false, error: null };
        case "FETCH_USER_DATA_ERROR":
            return { ...state, loading: false, error: action.payload };
        case "LOGOUT":
            return {...initialState, loading:false, error:null}
        default:
            return state;
    }
};

// Create Context
const UserContext = createContext<{
    state: State;
    fetchUserData: (token: string) => Promise<void>;
    logout:() => void;
}>({
    state: initialState,
    fetchUserData: async () => {},
    logout: () => {},
});

// Context Provider Component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    const logout = () => {
        localStorage.removeItem('access_token');
        dispatch({type:"LOGOUT"})
    }

    const fetchUserData = async (token: string) => {
        dispatch({ type: "START_FETCH_USER_DATA" });

        try {
            const response = await fetch("http://localhost:8080/api/user/info", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch");
            }

            const data: User = await response.json();
            dispatch({ type: "FETCH_USER_DATA_SUCCESS", payload: data });
        } catch (error) {
            if (error instanceof Error) {
                dispatch({ type: "FETCH_USER_DATA_ERROR", payload: error.message });
            }
        }
    };

    return (
        <UserContext.Provider value={{ state, fetchUserData, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext)
    return context;
}