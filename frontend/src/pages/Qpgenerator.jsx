import React, { useState } from "react";

function Qpgenerator() {
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/generate-questions");
      const data = await res.json();

      console.log("✅ Generated questions:", data);

      setChatHistory(prev => [
        ...prev,
        {
          sender: "bot",
          type: "html",
          message: data.html || "<p>No questions generated.</p>"
        }
      ]);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    setChatHistory(prev => [
      ...prev,
      { sender: "user", type: "text", message: chatInput }
    ]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat-qp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput })
      });
      const data = await res.json();

      // Auto detect if the bot message is HTML
      const isHTML = data.response && (data.response.trim().startsWith("<") || data.response.includes("</"));

      setChatHistory(prev => [
        ...prev,
        { sender: "bot", type: isHTML ? "html" : "text", message: data.response || "No response." }
      ]);

    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory(prev => [
        ...prev,
        { sender: "bot", type: "text", message: "⚠️ Error getting response." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Interview Question Assistant
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleGenerateQuestions}
          className="bg-purple-700 hover:bg-purple-800 px-6 py-2 rounded-full transition duration-300 font-semibold text-white"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white mb-4 h-96 overflow-y-auto space-y-4">
        {chatHistory.length === 0 && (
          <p className="text-gray-400">
            Click "Generate Questions" to start. Then ask your doubts or request more questions.
          </p>
        )}
        {chatHistory.map((chat, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              chat.sender === "user" ? "bg-purple-700 w-auto h-auto ml-auto" : "bg-gray-700 mr-auto"
            }`}
          >
            {chat.type === "html" ? (
              <div dangerouslySetInnerHTML={{ __html: chat.message }} />
            ) : (
              chat.message
            )}
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask your assistant..."
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-purple-700 w-auto h-auto hover:bg-purple-800 px-6 py-2 rounded-full transition duration-300 font-semibold"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Qpgenerator;
