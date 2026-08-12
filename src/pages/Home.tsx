import React, { useState } from "react";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("https://lynkr-backend-3kal.onrender.com/api/v1/urls/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: inputUrl }),
      });
      const data = await response.json();
      setShortUrl(`https://lynkr-backend-3kal.onrender.com/${data.customAlias || data.shortCode}`);
    } catch (err) {
      console.error("Shortening failed", err);
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <div className="relative z-50 p-6 max-w-xl mx-auto">
        <form onSubmit={handleShorten} className="flex flex-col gap-4">
          <input
            type="url"
            required
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste your long URL here (e.g. https://example.com)..."
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-blue-500 relative z-50 pointer-events-auto"
          />
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold cursor-pointer relative z-50 pointer-events-auto"
          >
            Shorten URL
          </button>
        </form>

        {shortUrl && (
          <div className="mt-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline font-mono break-all">
              {shortUrl}
            </a>
            <button 
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="ml-3 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-lg cursor-pointer"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
