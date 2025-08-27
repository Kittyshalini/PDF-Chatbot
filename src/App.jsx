import { useState } from "react";
import './index.css';

export default function ChatApp() {
  const [file, setFile] = useState(null);
  const [vectorsReady, setVectorsReady] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi 👋, upload a PDF to get started!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/read", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("PDF processing failed");
      }

      setVectorsReady(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "✅ PDF processed! Now ask me anything." },
      ]);
    } catch (err) {
      console.error(err);
      alert("Failed to upload or process the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to get a response from the server");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "🤔 No response" },
      ]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while sending your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">

      {/* Upload Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Upload your PDF</h2>
        <input type="file" onChange={handleFileUpload} />
        {loading && <p className="mt-2 text-gray-600">⏳ Processing...</p>}
      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-full max-w-2xl h-[70vh] border rounded-lg shadow-lg bg-white">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-t-lg">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-xl ${
                  msg.role === "user"
                    ? "bg-pink-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <span className="inline-block px-3 py-2 rounded-xl bg-gray-300 text-black">
                Thinking...
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex p-3 border-t">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 mr-2"
            placeholder={
              vectorsReady ? "Ask something..." : "Upload a PDF first..."
            }
            disabled={!vectorsReady}
          />
          <button
            onClick={handleSendMessage}
            disabled={!vectorsReady}
            className={`px-6 py-2 rounded-lg text-white ${
              vectorsReady
                ? "bg-pink-500 hover:bg-pink-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
