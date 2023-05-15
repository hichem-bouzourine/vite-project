import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [typingDisplay, setTypingDisplay] = useState<string>("");

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    socket.emit("findAllMessages", {}, (res: any) => {
      setMessages(res);
    });

    socket.on("message", (message: any) => {
      setMessages((prev: any) => [...prev, message]);
    });

    socket.on("typing", ({ name, isTyping }) => {
      if (isTyping) setTypingDisplay(`${name} is typing...`);
      else setTypingDisplay("");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    socket.emit("createMessage", { name, text: currentMessage }, (res: any) => {
      setCurrentMessage("");
    });
  };

  const join = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    socket.emit("join", { name }, (res: any) => {
      setJoined(true);
    });
  };

  const emitTyping = () => {
    socket.emit("typing", { isTyping: true });

    setTimeout(() => {
      socket.emit("typing", { isTyping: false });
    }, 2000);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    emitTyping();
    setCurrentMessage(event.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      {!joined && (
        <div>
          <form onSubmit={join}>
            <label>
              What's your name?
              <input type="text" value={name} onChange={handleNameChange} />
            </label>
            <button type="submit">Send</button>
          </form>
        </div>
      )}

      {joined && socket && (
        <>
          <div>
            {messages.map((msg: any) => (
              <div key={Math.random()}>
                <p>
                  [{msg.name}]: {msg.text}
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
        </>
      )}
    </div>
  );
};

export default App;
