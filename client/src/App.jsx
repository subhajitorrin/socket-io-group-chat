import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [totalClients, settotalClients] = useState(0);
  const [input, setInput] = useState("");
  const [clientName, setClientName] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    socket.on("clients-total", (num) => {
      settotalClients(num);
    });
    socket.on("broadcast-msg", (data) => {
      setMsgList((prev) => [...prev, data]);
    });
    socket.on("is-typing", (data) => {
      setFeedback(data);
    });
  }, []);

  function handleSendMsg() {
    if (input.trim() != "") {
      socket.emit("msg-from-client", {
        msg: input,
        time: new Date(),
        sender: clientName != "" ? clientName : "anonymous",
      });
      setInput("")
    }
  }
  return (
    <div className="container">
      <p>Total clients connected {totalClients}</p>
      <input
        type="text"
        autocomplete="off"
        id="clientname"
        onChange={(e) => {
          setClientName(e.target.value);
        }}
        placeholder="enter username"
      />
      <input
        type="text"
        id="textinput"
        value={input}
        autocomplete="off"
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onFocus={() => {
          socket.emit("feedback", `${clientName} is typing...`);
        }}
        onKeyDown={() => {
          socket.emit("feedback", `${clientName} is typing...`);
        }}
        onBlur={() => {
          socket.emit("feedback", ``);
        }}
        placeholder="enter text..."
      />
      <button onClick={handleSendMsg}>Send</button>
      <div className="">
        {msgList.map((item, index) => {
          return (
            <p>
              {item.sender} | {item.time} | {item.msg}
            </p>
          );
        })}
      </div>
      <p>{feedback}</p>
    </div>
  );
}

export default App;
