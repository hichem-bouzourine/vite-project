import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [typingDisplay, setTypingDisplay] = useState<string>("");
  const [connectedRoom, setConnectedRoom] = useState<number>();

  const [id_conversation, setId_conversation] = useState<number>(1);
  const [id_destinateur, setId_destinateur] = useState<number>(7);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit(
        "joinRoom",
        {
          id_conversation,
          id_destinateur,
        },
        (res: any) => {
          setMessages(res);
        }
      );

      socket.on("loadMessages", (message: any[]) => {
        console.log(message);
        setMessages(message);
      });

      socket.on("newMessage", (message: any) => {
        console.log("new Message!", message);

        setMessages((prev: any) => [...prev, message]);
      });

      socket.on("connectedRoom", (roomName: number) => {
        setConnectedRoom(roomName);
        console.log(`Connected to room: ${roomName}`);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    socket.emit(
      "sendMessage",
      { id_conversation, id_destinateur, message: currentMessage },
      (res: any) => {
        setCurrentMessage("");
      }
    );
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(event.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      {socket && (
        <div>
          <div style={{ maxHeight: "400px", overflow: "auto" }}>
            {messages.map((msg: any) => (
              <div key={Math.random()}>
                <p>
                  [{msg.id_destinateur}]: {msg.contenu}
                </p>
              </div>
            ))}
          </div>

          {typingDisplay && <div>{typingDisplay}</div>}

          <hr />

          <div>
            <form onSubmit={createMessage}>
              <label>
                Message:
                <input
                  type="text"
                  value={currentMessage}
                  onChange={handleMessageChange}
                />
              </label>
              <button type="submit">Send</button>
            </form>
          </div>
          <p>connected room:{connectedRoom}</p>
        </div>
      )}
    </div>
  );
};

export default App;
