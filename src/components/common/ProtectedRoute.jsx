import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ roles, children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && roles.length > 0) {
        const hasRole = user.roles && roles.some(role => user.roles.includes(role));
        if (!hasRole) {
            return <Navigate to="/" replace />; // Or unauthorized page
        }
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
