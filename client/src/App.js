import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [room, setRoom] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const socket = io("http://localhost:8080", {
    auth: {
      token: "abc",
    },
  });

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    login();
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      socket.emit("chat message", { msg: messageInput, room: currentRoom });
      setMessageInput("");
    }
  };

  const createRoom = () => {
    if (room.trim() !== "") {
      socket.emit("create room", room);
      setCurrentRoom(room);
      setRoom("");
    }
  };

  const joinRoom = () => {
    if (room.trim() !== "") {
      socket.emit("join room", room);
      setCurrentRoom(room);
      setRoom("");
    }
  };

  const leaveRoom = () => {
    socket.emit("leave room", currentRoom);
    setMessages([]);
    setCurrentRoom("");
  };

  // Add a login function in your React component
  const login = async () => {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "admin", password: "password" }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("🚀 ~ login ~ data:", data);
      const { token } = data;
      localStorage.setItem("token", token);
    } else {
      console.error("Login failed");
    }
  };

  return (
    <div>
      {currentRoom ? (
        <>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              backgroundColor: "black",
              color: "white",
              padding: "10px 0",
            }}
          >
            <h1 style={{ margin: "0" }}>Socket.IO Chat</h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                marginBottom: "10px",
                fontSize: "18px",
              }}
            >
              Current Room:{" "}
              <span style={{ fontWeight: "bold", fontSize: "20px" }}>
                {currentRoom}
              </span>
            </p>
            <button
              onClick={leaveRoom}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Leave Room
            </button>
          </div>
          {currentRoom ? (
            <ul
              id="messages"
              style={{ listStyleType: "none", margin: 0, padding: 0 }}
            >
              {messages.map((msg, index) => (
                <li
                  key={index}
                  style={{
                    padding: "0.5rem 1rem",
                    background: index % 2 === 0 ? "#efefef" : "white",
                  }}
                >
                  {msg}
                </li>
              ))}
            </ul>
          ) : null}
          <form
            onSubmit={sendMessage}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0, 0, 0, 0.15)",
              padding: "0.25rem",
              display: "flex",
              height: "3rem",
              boxSizing: "border-box",
              backdropFilter: "blur(10px)",
            }}
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              style={{
                border: "none",
                padding: "0 1rem",
                flexGrow: 1,
                borderRadius: "2rem",
                margin: "0.25rem",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#333",
                border: "none",
                padding: "0 1rem",
                margin: "0.25rem",
                borderRadius: "3px",
                color: "#fff",
                outline: "none",
              }}
            >
              Send
            </button>
          </form>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            height: "100vh",
            backgroundColor: "#f2f2f2",
          }}
        >
          <div style={{ width: "30%" }}>
            <input
              type="text"
              placeholder="Enter room name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              style={{
                width: "92.5%",
                padding: "12px 20px",
                margin: "8px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
            <div style={{ display: "flex", gap: "10px", width: "100%" }}>
              <button
                onClick={createRoom}
                style={{
                  width: "100%",
                  backgroundColor: "#008CBA",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Create Room
              </button>
              <button
                onClick={joinRoom}
                style={{
                  width: "100%",
                  backgroundColor: "#04AA6D",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
