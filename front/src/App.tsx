import React, {useEffect, useState} from 'react';
import "./styles/App.css"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./components/Login";
import Main from "./components/Main";
import GameList from "./components/GameList";


function App() {
    // const [isLoading, setIsLoading] = useState(true);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    //
    // // Функция для проверки статуса авторизации при загрузке приложения
    // useEffect(() => {
    //     async function checkAuthentication() {
    //         try {
    //             const response = await fetch('/auth/check', { credentials: 'include' });
    //             const data = await response.json();
    //
    //             if (data.isAuthenticated) {
    //                 setIsLoggedIn(true);
    //             }
    //         } catch (error) {
    //             console.error('Ошибка при проверке статуса авторизации:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    //
    //     checkAuthentication();
    // }, []);

    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Main/>}/>
              <Route path="/login" element={<Login/>} />
              <Route path="/games" element={<GameList/>} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
