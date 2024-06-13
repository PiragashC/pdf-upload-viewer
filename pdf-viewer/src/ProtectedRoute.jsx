import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuth = Boolean(useSelector((state) => state.token));
    const user = useSelector((state) => state.user);

    const isHomeComponent = children.type && children.type.name === 'Home';

    if (isHomeComponent) {
        if (isAuth) {
            if (user.role === 'User') {
                return children;
            } else {
                return <Navigate to="/files" />;
            }
        } else {
            return children;
        }
    } else {
        if (!isAuth) {
            return <Navigate to="/sign-in" />;
        }
        return children;
    }
}

export default ProtectedRoute;
