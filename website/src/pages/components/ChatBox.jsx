import React, { useState, useEffect, useRef } from 'react';
import sendIcon from '../../assets/paperplaneIcon.svg'
import crossIcon from '../../assets/crossIcon.svg'
import chatIcon from '../../assets/chatIcon.svg'

function ChatBox() {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false); 
    const [loading, setLoading] = useState(false);

    const outputFieldRef = useRef(null);

    const sendMessage = async () => {
        if (input.trim() === "") return;
        
        const userMessage = { text: input, sender: "user" };
        setMessages([...messages, userMessage]);
        setInput("");
        
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: input })
            })
            const data = await response.json();

            // Add the response from the backend to the chat
            const botMessage = { text: data.reply, sender: "bot" };
            setMessages((prev) => [...prev, botMessage]);

        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    }; 

    useEffect(() => {
        if (outputFieldRef.current) {
            outputFieldRef.current.scrollTop = outputFieldRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='z-10'>
            {isOpen ? (
                <div className='w-[40vh] h-fit fixed bg-gray-100 right-10 bottom-10 rounded-2xl overflow-clip shadow-2xl'>
                    <div className='w-full h-[6vh] flex'>
                        <img src={crossIcon} alt="Close chat" onClick={() => setIsOpen(false)} className='h-[1em] m-auto mr-5 cursor-pointer' />
                    </div>
                <div id='output-field' ref={outputFieldRef} className='w-full h-[35vh] flex flex-col overflow-auto p-3'>
                    {messages.map((msg, index) => (
                        <div 
                        key={index} 
                        className={`p-2 rounded-lg max-w-[80%] break-words ${
                            msg.sender === "user" 
                                ? "bg-blue-500 text-white self-end float-right my-1"  // Style for user messages
                                : "bg-gray-300 text-black self-start my-1" // Style for received messages
                        }`}>
                            
                        {msg.text}
                        </div> 
                    ))}
                    {loading && (
                        <div className="self-start bg-gray-300 text-black p-2 rounded-lg text-sm my-1 flex items-center space-x-1">
                            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    )}
                </div>
                <div id='input-section' className='w-full h-[5vw] bg-gray-800 text-zinc-300 flex items-center'>
                    <input 
                        type="text" 
                        placeholder="Ask anything..." 
                        className="m-5 mr-auto bg-transparent outline-none text-white w-2/3"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Send on Enter
                    />
                    <img src={sendIcon} alt="" onClick={() => sendMessage()} className='h-[1em] ml-auto m-5 cursor-pointer' />
                </div>
            </div>
                ) : (
                    <button className="fixed right-10 bottom-10 bg-blue-500 text-white px-2 py-2 cursor-pointer rounded-full shadow-lg hover:scale-110 transform transition duration-150 ease-in-out"
                        onClick={() => setIsOpen(true)}
                        >

                        <img src={chatIcon} alt="" className='h-[2em] fill-white m-2' />
                    </button>
                )
            }
        </div>
    );
};

export default ChatBox