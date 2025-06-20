import React, { useEffect, ComponentType } from 'react';
import { useNavigate } from "react-router-dom";
import { LOCAL_STORAGE, ROUTE } from '../utils/constant';

/**
 * Higher-order component that wraps a given component and adds authentication logic.
 * It checks if the user has a valid access token or refresh token in local storage.
 * If the tokens are missing, it redirects the user to the sign-in page.
 *
 * @param Component - The component to be wrapped and protected by authentication.
 * @returns A new component that checks for authentication before rendering the wrapped component.
 */

const RouteGuard = <P extends object>(Component: ComponentType<P>) => {
    const AuthenticatedComponent: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const token = localStorage.getItem(LOCAL_STORAGE.SESSION_TOKEN);

            if (!token) {
                navigate(ROUTE.LOGIN);
            };
        }, [navigate]);

        return <Component { ...props } />;
    };

    return AuthenticatedComponent;
};

export default RouteGuard;
