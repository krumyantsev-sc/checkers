import React, {createContext, useContext, useState} from 'react';

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
    login: () => {
    },
    logout: () => {
    },
    giveAdminAccess: () => {
    },
    makeGuest: () => {
    },
    isAdmin: false
});

export const useAuth = () => {
    return useContext(AuthContext);
};

interface AuthProviderProps extends React.PropsWithChildren<{}> {
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const login = () => {
        setIsAuthenticated(true);
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
        <AuthContext.Provider
            value={{isAuthenticated, login, logout, giveAdminAccess, makeGuest, isAdmin}}>
            {children}
        </AuthContext.Provider>
    );
};