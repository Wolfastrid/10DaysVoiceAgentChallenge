import React, { useState } from "react";


export const InputBox: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
const [text, setText] = useState("");


function handleSend() {
if (!text.trim()) return;
onSend(text);
setText("");
}


const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
if (e.key === "Enter") handleSend();
};


return (
<div className="flex gap-2 mt-4">
<input
className="flex-1 p-3 border rounded-xl shadow focus:outline-blue-500"
placeholder="Type your message…"
value={text}
onChange={(e) => setText(e.target.value)}
onKeyDown={handleKeyDown}
/>


<button
className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
onClick={handleSend}
>
Send
</button>
</div>
);
};