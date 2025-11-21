// import { useState, useRef, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import { sendSymptomToAI } from "./api";

// export default function ChatPage({ patientId }) {
//   const [logs, setLogs] = useState([]); // structured logs
//   const [activeLogIndex, setActiveLogIndex] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [severity, setSeverity] = useState(5);
//   const scrollRef = useRef(null);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   // Create a new log
//   const handleNewLog = () => {
//     setActiveLogIndex(null);
//     setMessages([]);
//     setInput("");
//     setSeverity(5);
//   };

//   // Delete a log
//   const handleDeleteLog = (index) => {
//     setLogs((prev) => prev.filter((_, i) => i !== index));
//     if (activeLogIndex === index) handleNewLog();
//   };

//   // AI Handling
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMsg = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setIsTyping(true);

//     const aiPlaceholder = { role: "assistant", content: "..." };
//     setMessages((prev) => [...prev, aiPlaceholder]);

//     try {
//       const aiResponse = await sendSymptomToAI({
//         patient: patientId,
//         prompt: input,
//       });
//       const structured = aiResponse.summary; // assume API returns structured log object

//       // Replace placeholder
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg === aiPlaceholder
//             ? { role: "assistant", content: structured }
//             : msg
//         )
//       );

//       // Save structured log
//       const newLog = {
//         symptom: input,
//         severity,
//         structured,
//         timestamp: new Date().toISOString(),
//       };
//       setLogs((prev) => [...prev, newLog]);
//       setActiveLogIndex(logs.length);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg === aiPlaceholder
//             ? { role: "assistant", content: "⚠ Failed to process. Try again." }
//             : msg
//         )
//       );
//     }

//     setIsTyping(false);
//   };

//   const handleMicClick = () => {
//     if (!("webkitSpeechRecognition" in window))
//       return alert("Speech recognition not supported.");
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.continuous = false;
//     recognition.interimResults = false;
//     recognition.onresult = (event) => setInput(event.results[0][0].transcript);
//     recognition.start();
//   };

//   return (
//     <div className="flex h-screen bg-[#F2F6FA]">
//       <Sidebar
//         logs={logs}
//         onSelectLog={setActiveLogIndex}
//         onDeleteLog={handleDeleteLog}
//         onNewLog={handleNewLog}
//       />

//       <div className="flex flex-col flex-1 p-6">
//         {/* Chat / Symptom Log */}
//         <div className="flex-1 overflow-y-auto space-y-3 mb-4">
//           {activeLogIndex !== null && logs[activeLogIndex] ? (
//             <div className="bg-white p-4 rounded-xl shadow">
//               <h3 className="font-semibold text-lg mb-2">Structured Log</h3>
//               <pre className="text-sm text-gray-700">
//                 {JSON.stringify(logs[activeLogIndex].structured, null, 2)}
//               </pre>
//             </div>
//           ) : (
//             messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`max-w-xl px-4 py-2 rounded-xl break-words ${
//                   msg.role === "user"
//                     ? "bg-blue-600 text-white self-end ml-auto"
//                     : "bg-white border border-gray-300 self-start mr-auto"
//                 }`}
//               >
//                 {msg.content === "..." ? (
//                   <div className="flex space-x-1">
//                     {[...Array(3)].map((_, i) => (
//                       <span
//                         key={i}
//                         className="dot w-2 h-2 rounded-full bg-gray-400 animate-bounce"
//                       ></span>
//                     ))}
//                   </div>
//                 ) : (
//                   msg.content
//                 )}
//               </div>
//             ))
//           )}
//           <div ref={scrollRef}></div>
//         </div>

//         {/* Input */}
//         {activeLogIndex === null && (
//           <div className="flex gap-2 items-center">
//             <button
//               onClick={handleMicClick}
//               className="bg-[#0A3D62] text-white p-3 rounded-full hover:bg-blue-700 transition"
//             >
//               🎤
//             </button>

//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) =>
//                 e.key === "Enter" &&
//                 !e.shiftKey &&
//                 (e.preventDefault(), handleSend())
//               }
//               placeholder="Describe your symptoms..."
//               className="flex-1 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={1}
//             />

//             <button
//               onClick={handleSend}
//               className="bg-[#0A3D62] text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
//             >
//               Send
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import { sendSymptomToAI } from "./api";

export default function ChatPage({ patientId = 0 }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const timestamp = new Date();
    const userMsg = { role: "user", content: input, timestamp };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Add AI placeholder with timestamp
    const aiPlaceholder = {
      role: "assistant",
      content: "...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiPlaceholder]);

    const aiResponse = await sendSymptomToAI(input, patientId);

    // Replace placeholder with actual response
    setMessages((prev) =>
      prev.map((msg) =>
        msg === aiPlaceholder ? { ...aiPlaceholder, content: aiResponse } : msg
      )
    );
    setIsTyping(false);
  };

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar messages={messages} />

      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xl px-4 py-2 rounded-xl break-words ${
                msg.role === "user"
                  ? "bg-blue-600 text-white self-end ml-auto"
                  : "bg-white border border-gray-300 self-start mr-auto flex items-center gap-2"
              }`}
            >
              {msg.content === "..." ? (
                <div className="flex space-x-1">
                  <span className="dot bg-gray-400 animate-bounce w-2 h-2 rounded-full"></span>
                  <span className="dot bg-gray-400 animate-bounce w-2 h-2 rounded-full"></span>
                  <span className="dot bg-gray-400 animate-bounce w-2 h-2 rounded-full"></span>
                </div>
              ) : (
                msg.content
              )}
              <p className="text-xs text-gray-400 mt-1 ml-auto">
                {msg.timestamp?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        <div className="p-4 bg-white border-t flex gap-2 items-center">
          <button
            onClick={handleMicClick}
            className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition"
          >
            🎤
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSend())
            }
            placeholder="Describe how you feel..."
            className="flex-1 border rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
