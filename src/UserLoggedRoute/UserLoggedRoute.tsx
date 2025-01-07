import React from "react";
import { Navigate } from "react-router";
import { useUserContext } from "../Context/UserContext";

interface RouteProps  {
    children: React.ReactNode,
}

const UserLoggedRoute = ({children}:RouteProps) => {
    const {state} = useUserContext();
    
    if (state.user) {
        return <Navigate to="/"/>
    }
    return <>{children}</>
}
export default UserLoggedRoute