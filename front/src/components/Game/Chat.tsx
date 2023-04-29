import React, { useState, useEffect } from 'react';
import socket from "../../API/socket";

import '../../styles/Chat.css';
import {useParams} from "react-router-dom";
import ChatService from "../../API/ChatService";
import CheckerService from "../../API/CheckerService";

interface IMessage {
    author: string;
    text: string;
}

interface GameProps {
    gameId: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [author, setAuthor] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    let { gameId } : any = useParams<Record<keyof GameProps, string>>();
    useEffect(() => {
        socket.connect();
        // Получение всех сообщений при подключении
        socket.on('messages', (data: IMessage[]) => {
            setMessages(data);
        });

        // Получение нового сообщения
        socket.on('newMessage', (data: IMessage) => {
            setMessages(prevMessages => [...prevMessages, data]);
        });

        return () => {
            socket.off('messages');
            socket.off('newMessage');
        };
    }, []);

    const getMessages = async () => {
        try {
            const res = await ChatService.getMessageHistory(gameId);
            const history = await res.data;
            if (history) {
                setMessages(history);
            }
        } catch (error) {
            console.error('Ошибка при получении поля:', error);
            // navigate('/');
        }
    }

    useEffect(() => {
        getMessages();
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!message) return;
        ChatService.sendMessage(gameId,message);
        setAuthor('');
        setMessage('');
    };

    return (
        <div className="chat">
            <h1>Chat</h1>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <strong>{message.author}: </strong>
                        {message.text}
                    </div>
                ))}
            </div>
            <form className="chat-submit-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    className="input"
                />
                <button type="submit" className="button">Send</button>
            </form>
        </div>
    );
};

export default Chat;