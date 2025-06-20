import React, { useEffect, ComponentType } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LOCAL_STORAGE, ROLE, ROUTE } from '../utils/constant';

/**
 * Higher-order component that wraps a given component and adds role-based logic.
 * It checks if the user has a valid role ID in local storage.
 * If the role is missing, it redirects the user to the login page.
 *
 * @param Component - The component to be wrapped and protected by role.
 * @returns A new component that checks for the role before rendering the wrapped component.
 */
const RoleGuard = <P extends object>(Component: ComponentType<P>) => {
    const AuthenticatedComponent: React.FC<P> = (props) => {
        const navigate = useNavigate();
        const location = useLocation();

        useEffect(() => {
            const role = localStorage.getItem(LOCAL_STORAGE.ROLE_ID);

            if (!role) {
                navigate(ROUTE.LOGIN);
                return;
            }

            const userRole = Number(role);

            // Define role-based redirection logic
            if (userRole === ROLE.ADMIN) {
                return;
            }

            if (userRole === ROLE.CONTRIBUTOR || userRole === ROLE.MANAGER) {
                navigate(ROUTE.TASK_CHECK);
                return;
            }

            // If the user is ACCOUNT, allow only APPRAISAL or PAYDATA routes
            if (userRole === ROLE.ACCOUNT) {
                const allowedRoutes = [ROUTE.APPRAISAL, ROUTE.PAYDATA];

                if (!allowedRoutes.includes(location.pathname)) {
                    navigate(ROUTE.APPRAISAL);
                    return;
                };
                return;
            }

            navigate(ROUTE.LOGIN);

        }, [navigate, location]);

        return <Component {...props} />;
    };

    return AuthenticatedComponent;
};

export default RoleGuard;
