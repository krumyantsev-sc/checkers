import React, {useEffect, useState} from 'react';
import "./styles/App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/Login";
import Main from "./components/Main";
import GameList from "./components/GameList";
import RoomList from "./components/RoomList";
import Lobby from "./components/Lobby";
import Game from "./components/Game/Game";
import Profile from "./components/Profile";
import AuthService from "./API/AuthService";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/util/ProtectedRoute";
import SideMenu from "./components/SideMenu";


function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Функция для проверки статуса авторизации при загрузке приложения
    useEffect(() => {
        async function checkAuthentication() {
            try {
                const response = await AuthService.check();
                const data = await response.data;
                if (data.isAuthenticated) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log('Ошибка при проверке статуса авторизации:', error);
                window.location.reload();
            } finally {
                setIsLoading(false);
            }
        }

        checkAuthentication();
    }, []);

    if (isLoading) {
        return <Loading/>;
    }
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Main/>}/>
              <Route path="/login" element={<Login/>} />
              <Route path="/games" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                  <GameList/>
              </ProtectedRoute> } />
              <Route path="/games/:gameName" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                  <RoomList/>
              </ProtectedRoute> } />
              <Route path="/games/:gameName/:gameId" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                  <Lobby/>
              </ProtectedRoute> } />
              <Route path="/games/:gameName/:gameId/game" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                  <Game/>
              </ProtectedRoute> } />
              <Route path="/profile" element={ <ProtectedRoute isSignedIn={isLoggedIn}>
                  <Profile/>
              </ProtectedRoute> } />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
