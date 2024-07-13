import React, { useCallback, useEffect, useState, useRef } from "react";
import Pubnub from "pubnub";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "antd";
import "./room.css";

const myID = `${Date.now()}`;

const pubnub = new Pubnub({
    publishKey: "pub-c-ee1784cc-29d5-422e-8ba9-acf209b1855a",
    subscribeKey: "sub-c-16d25a4d-ebb3-447c-aab6-9c40ba30392e",
    secretKey: "sec-c-ZTQ0MzFiNTctOWMxZi00OWJjLTkyNzAtNzBiODg5MDM3Zjg3",
    userId: myID,
});

const Room: React.FC = () => {

    const { roomCode } = useParams<{ roomCode: string }>();
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messages, setMessages] = useState<Pubnub.MessageEvent[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const username = location.state?.username || "";

    useEffect(() => {
        if (roomCode) {
            pubnub.subscribe({
                channels: [roomCode],
            });

            const listener = {
                message: (messageEvent: Pubnub.MessageEvent) => {
                    console.log(messageEvent)
                    setMessages((prevMessages => [...prevMessages, messageEvent]))
                }
            }

            pubnub.addListener(listener)

            return () => {
                pubnub.unsubscribe({
                    channels: [roomCode],
                });
                pubnub.removeListener(listener);
            };
        }
    }, [roomCode]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = useCallback(() => {
        if (currentMessage && roomCode) {
            const messageObject = {
                text: currentMessage,
                username: username,
                time: new Date().toLocaleTimeString(),
            };

            pubnub.publish({
                channel: roomCode,
                message: messageObject,
            });
        }
        setCurrentMessage("");
    }, [currentMessage, roomCode, username]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className="chat-room-container">
            <h1 className="room-name">Chat room {roomCode}</h1>
            <div className="message-box">
                {messages.map((message) => (
                    <div className={`message ${message.publisher === myID ? "myMessage" : ""}`} key={message.timetoken}>
                        <div className="message-username">{message.message.username}</div>
                        <div className="message-text">{message.message.text}</div>
                        <div className="message-time">{message.message.time}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* empty div for scrolling to the bottom */}
            </div>
            <div className="message-input-container">
                <textarea
                    className="message-input"
                    placeholder="Enter your message"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button className="send-button" disabled={currentMessage === ""} type="primary" onClick={handleSendMessage}>Add</Button>
            </div>
        </div>
    );
}

export default Room;
