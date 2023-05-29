import React from 'react'
import {Navigate} from 'react-router-dom'

interface ProtectedRouteProps {
    isSignedIn: boolean;
    children: React.ReactNode;
}

function ProtectedRoute({isSignedIn, children}: ProtectedRouteProps) {
    if (!isSignedIn) {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
}

export default ProtectedRoute;