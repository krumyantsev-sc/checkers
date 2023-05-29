import React, {useEffect, useState} from 'react';
import "./styles/App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/auth/Login";
import Main from "./components/main/Main";
import GameList from "./components/GameList/GameList";
import RoomList from "./components/RoomList/RoomList";
import Lobby from "./components/Lobby/Lobby";
import Game from "./components/Game/Game";
import Profile from "./components/Profile/Profile";
import AuthService from "./API/AuthService";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/util/ProtectedRoute";
import SideMenu from "./components/SideMenu";
import {AuthProvider, useAuth} from "./components/auth/AuthContext";
import UserList from "./components/admin/UserList";
import {ModalProvider} from "./components/Modal/ModalContext";
import GameWrapper from "./components/GameWrapper";
import Contact from "./components/main/Contact";
import Rules from "./components/main/Rules";


function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { isAuthenticated, login, logout, giveAdminAccess } = useAuth();


        async function checkAuthentication() {
            try {
                const response = await AuthService.check();
                const data = await response.data;
                if (data.isAuthenticated) {
                    console.log("authenticated")
                    setIsLoggedIn(true);
                    login();
                } else {
                    setIsLoggedIn(false);
                }
                if (data.isAdmin) {
                    giveAdminAccess();
                }
            } catch (error) {
                console.log('Ошибка при проверке статуса авторизации:', error);
                window.location.reload();
            } finally {
                setIsLoading(false);
            }
        }

        checkAuthentication();


    if (isLoading) {
        return <Loading/>;
    }
    return (
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Main/>}/>
                  <Route path="/contact" element={<Contact/>}/>
                  <Route path="/rules" element={<Rules/>}/>
                  <Route path="/login" element={<Login/>} />
                  <Route path="/games" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                      <GameList/>
                  </ProtectedRoute> } />
                  <Route path="/games/:gameName" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                      <RoomList/>
                  </ProtectedRoute> } />
                  <Route path="/games/:gameName/:gameId" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                      <ModalProvider>
                        <Lobby/>
                      </ModalProvider>
                  </ProtectedRoute> } />
                  <Route path="/games/:gameName/:gameId/game" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                      <GameWrapper/>
                  </ProtectedRoute> } />
                  <Route path="/profile" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                      <Profile/>
                  </ProtectedRoute> } />
                  <Route path="/admin" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                      <ModalProvider>
                      <UserList/>
                      </ModalProvider>
                  </ProtectedRoute> } />
              </Routes>
          </BrowserRouter>
  );
}

export default App;
