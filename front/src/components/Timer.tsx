import React, {useEffect, useState} from 'react';
import socket from "../API/socket";
import {useParams} from "react-router-dom";
import CheckerService from "../API/CheckerService";
import TicTacToeService from "../API/Tic-Tac-ToeService";
import "../styles/Timer.css"

const Timer: React.FC = () => {
    let {gameName} = useParams();
    const [timerValue, setTimerValue] = useState<number>(() => {
        const storedValue = localStorage.getItem('timerValue');
        return storedValue ? parseInt(storedValue, 10) : 30;
    });
    let {gameId} = useParams();
    let timerId: NodeJS.Timeout | number | null = null;


    useEffect(() => {
        socket.on('connect', () => {
            console.log('Подключено к серверу');
        });

        socket.on('syncTime', (serverTime: number) => {
            const clientTime = new Date().getTime();
            const serverClientTimeDiff = serverTime - clientTime;
            const remainingTime = 30 - Math.floor(serverClientTimeDiff / 1000);
            localStorage.setItem('timerValue', remainingTime.toString());
            setTimerValue(remainingTime);
            startTimer();
        });

        socket.on('disconnect', () => {
            clearTimer();
        });

        socket.on('enemyReconnected', () => {
            clearTimer();
        });

        return () => {
            clearTimer();
        };
    }, []);

    useEffect(() => {
        updateTimerDisplay();
        if (timerValue === 0) {
            handleTimerFinish();
        }
    }, [timerValue]);

    useEffect(() => {
        const savedTimerData = localStorage.getItem('timerData');
        if (savedTimerData) {
            const {value, time} = JSON.parse(savedTimerData);
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - time;
            const remainingTime = value - Math.floor(elapsedTime / 1000);
            if (remainingTime > 0 && remainingTime <= 30) {
                setTimerValue(remainingTime);
                startTimer();
                return;
            }
        }
        startTimer();
        return () => {
            clearTimer();
        };
    }, []);

    const startTimer = () => {
        clearTimer();
        timerId = setInterval(() => {
            setTimerValue(prevValue => {
                const newValue = prevValue - 1;
                const currentTime = new Date().getTime();
                localStorage.setItem('timerData', JSON.stringify({value: newValue, time: currentTime}));
                if (newValue === 0) {
                    handleTimerFinish();
                    clearTimer();
                }
                return newValue;
            });
        }, 1000);
    };

    const clearTimer = () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    };

    const updateTimerDisplay = () => {
        return <div className="timer-seconds">{timerValue} seconds</div>;
    };

    const handleTimerFinish = () => {
        if (gameName === "checkers") {
            CheckerService.finishGameByDisconnect(gameId!);
        } else {
            TicTacToeService.finishGameByDisconnect(gameId!);
        }
        localStorage.removeItem('timerValue');
    };

    return (
        <div className="timer">
            <h1>Game ends in:</h1>
            {updateTimerDisplay()}
        </div>
    );
};

export default Timer;