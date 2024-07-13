import React, { useCallback, useState } from "react";
import { Input, Button } from "antd"
import "./lobby.css";
import { useNavigate } from "react-router-dom"

const Lobby: React.FC = () => {

    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState<string>("");
    const [name, setName] = useState<string>("");

    const handleRoomJoin = useCallback(() => {
        navigate(`/room/${roomCode}`, { state: { username: name } })
    }, [navigate, roomCode, name])

    return (
        <div className="lobby-container">
            <h1>Please enter the room number</h1>
            <Input className="name-container" type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)}/>
            <div className="room-number-container">
                <Input type="text" placeholder="Enter room number" value={roomCode} onChange={(e) => setRoomCode(e.target.value)}/>
                <Button disabled={roomCode === "" || name === ""} type="primary" onClick={handleRoomJoin}>Enter</Button>
            </div>
        </div>
    )
}

export default Lobby;