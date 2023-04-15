import { io } from "socket.io-client";

const URL: string = "http://localhost:3001";
const socket = io(URL, { autoConnect: false, withCredentials: true });

export default socket;