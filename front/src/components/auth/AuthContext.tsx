import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextInterface {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    giveAdminAccess: () => void;
    makeGuest: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextInterface>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    giveAdminAccess: () => {},
    makeGuest: () => {},
    isAdmin: false
});

export const useAuth = () => {
    return useContext(AuthContext);
};

interface AuthProviderProps extends React.PropsWithChildren<{}> {}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
        console.log('login')
        console.log(isAuthenticated)
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    const giveAdminAccess = () => {
        setIsAdmin(true);
    }

    const makeGuest = () => {
        setIsAdmin(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, giveAdminAccess, makeGuest, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};