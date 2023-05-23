import React, { useEffect, useState } from 'react';
import socket from "../API/socket";

const Timer: React.FC = () => {
    const [timerValue, setTimerValue] = useState<number>(() => {
        const storedValue = localStorage.getItem('timerValue');
        return storedValue ? parseInt(storedValue, 10) : 30;
    });
    let timerId: NodeJS.Timeout | null = null;

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Подключено к серверу');


        });
        socket.on('syncTime', (serverTime: number) => {
            console.log(serverTime)
            const clientTime = new Date().getTime();
            console.log(clientTime)
            const serverClientTimeDiff = serverTime - clientTime;

            console.log('Разница между серверным и клиентским временем:', serverClientTimeDiff);

            // Вычисляем время, оставшееся до истечения 30 секунд
            const remainingTime = 30 - Math.floor(serverClientTimeDiff / 1000);

            // Сохраняем значение таймера в локальное хранилище
            localStorage.setItem('timerValue', remainingTime.toString());

            // Устанавливаем значение таймера
            setTimerValue(remainingTime);

            // Запускаем таймер
            startTimer();
        });
        socket.on('disconnect', () => {
            console.log('Отключено от сервера');

            // Очищаем таймер при отключении от сервера
            clearTimer();
        });

        return () => {
            // Очищаем таймер при размонтировании компонента
            clearTimer();
        };
    }, []);

    useEffect(() => {
        // Обновляем отображение таймера при изменении его значения
        updateTimerDisplay();

        // Проверяем, достигло ли значение таймера 0
        if (timerValue === 0) {
            handleTimerFinish();
        }
    }, [timerValue]);

    useEffect(() => {
        const savedTimerData = localStorage.getItem('timerData');

        if (savedTimerData) {
            const { value, time } = JSON.parse(savedTimerData);
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - time;
            const remainingTime = value - Math.floor(elapsedTime / 1000);

            if (remainingTime > 0 && remainingTime <= 30) {
                setTimerValue(remainingTime);
                startTimer();
                return;
            }
        }

        // Если сохраненные данные недоступны или истекло больше 30 секунд, запустите новый таймер
        startTimer();

        return () => {
            // Очищаем таймер при размонтировании компонента
            clearTimer();
        };
    }, []);

    // Функция запуска таймера
    const startTimer = () => {
        clearTimer();
        timerId = setInterval(() => {
            setTimerValue(prevValue => {
                const newValue = prevValue - 1;

                // Сохраняем значение таймера и текущее время в локальное хранилище
                const currentTime = new Date().getTime();
                localStorage.setItem('timerData', JSON.stringify({ value: newValue, time: currentTime }));

                // Проверяем, достигло ли значение таймера 0
                if (newValue === 0) {
                    handleTimerFinish();
                    clearTimer();
                }

                return newValue;
            });
        }, 1000);
    };

    // Функция очистки таймера
    const clearTimer = () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    };

    // Функция обновления отображения таймера
    const updateTimerDisplay = () => {
        return <div>{timerValue} seconds</div>;
    };
    const handleTimerFinish = () => {
        console.log('Таймер завершился');
        // Здесь вы можете выполнить действия, которые должны произойти после завершения таймера

        // Очищаем значение таймера в локальном хранилище
        localStorage.removeItem('timerValue');
    };

    return (
        <div>
            <h1>Game ends in:</h1>
            {updateTimerDisplay()}
        </div>
    );
};

export default Timer;