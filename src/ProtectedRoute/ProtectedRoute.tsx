import React from "react";
import { Navigate } from "react-router";
import { useUserContext } from "../Context/UserContext";

interface ProtectedRouteProps  {
    children: React.ReactNode,
}

const ProtectedRoute = ({children}:ProtectedRouteProps) => {
    const {state} = useUserContext();
    
    if (state.user) {
        return <Navigate to="/"/>
    }
    return <>{children}</>
}
export default ProtectedRoute