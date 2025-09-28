import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

// Ensure this is the RAW URL, typically starting with raw.githubusercontent.com
const SRIHARAN_IMAGE_URL = 'https://raw.githubusercontent.com/SriharanVJ/Portfolio/main/Sriharan%20Photo.jpg'; 

// Set the base URL for your FastAPI server
const FASTAPI_URL = 'http://localhost:8000'; 

interface BotResponseData {
  response_text: string;
  audio_url: string; 
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]); 
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Refs for auto-scroll and input focus
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-Scroll Effect
  useEffect(() => {
    messagesEndRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus the input when the chat window opens
  useEffect(() => {
    if (isOpen) {
        inputRef.current?.focus();
    }
  }, [isOpen]); 

  const playAudio = (url: string) => {
    try {
      if (url) {
        const audio = new Audio(url); 
        audio.play().catch(error => {
          console.warn("Audio playback prevented:", error);
        });
      }
    } catch (e) {
      console.error("Failed to create or play audio object:", e);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, `User: ${userMessage}`]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post<BotResponseData>(`${FASTAPI_URL}/chat`, { 
        user_input: userMessage 
      });

      const { response_text, audio_url } = response.data;
      
      const botResponse = response_text || 'An unexpected error occurred in the bot.'; 
      setMessages(prev => [...prev, `Bot: ${botResponse}`]);
      
      if (audio_url) {
        playAudio(audio_url);
      }

    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages(prev => [...prev, "Bot: Sorry, I'm having trouble connecting to the server."]);
    } finally {
      setLoading(false);
      // Ensure focus is restored after the response
      inputRef.current?.focus(); 
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999]"> 
        
        {/* Chat Toggle Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="
                w-14 h-14 rounded-full bg-sky-600 text-white shadow-lg 
                flex items-center justify-center transition-transform duration-300 
                hover:scale-110 focus:outline-none 
                relative z-50 p-0 overflow-hidden 
            "
        >
            {isOpen ? (
                <X size={24} className="text-white" />
            ) : (
                <img 
                    src={SRIHARAN_IMAGE_URL} 
                    alt="Sriharan Chatbot Icon" 
                    className="w-full h-full object-cover rounded-full"
                />
            )}
        </button>

        {/* Chat Window Container */}
        {isOpen && (
            <div 
                className="
                    absolute bottom-0 right-0 transform translate-y-[-70px] 
                    w-80 h-[450px] bg-sky-100 text-foreground rounded-lg 
                    shadow-2xl flex flex-col overflow-hidden border border-border
                "
            >
                {/* Chat Header */}
                <div className="p-3 bg-sky-600 text-white font-poppins text-lg font-semibold flex justify-between items-center">
                    Chat with Sriharan's Bot
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Messages */}
                <div ref={messagesEndRef} className="flex-1 p-4 overflow-y-auto space-y-3">
                    {messages.length === 0 && (
                        <p className="text-muted-foreground text-sm">Hello! I'm Sriharan Personel Bot. Ask something about my Boss</p>
                    )}
                    {messages.map((msg, index) => (
                        // Message Bubbles
                        <div key={index} className={`max-w-[85%] p-2 rounded-lg text-sm ${
                            msg.startsWith('User:') 
                                ? 'ml-auto bg-sky-600 text-white' 
                                : 'mr-auto bg-sky-300 text-gray-800' 
                        }`}>
                            {msg.replace('User: ', '').replace('Bot: ', '')}
                        </div>
                    ))}
                    {loading && (
                         <div className="text-center text-sm text-muted-foreground">Bot is typing...</div>
                    )}
                </div>
                
                {/* Chat Input */}
                <div className="p-3 border-t border-border flex gap-2">
                    <input
                        ref={inputRef} 
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={loading}
                        className="flex-1 p-2 border border-input rounded-md bg-white focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                    />
                    {/* Send Button - THE FIX IS HERE */}
                    <button 
                        onClick={sendMessage} 
                        // 🚀 CRITICAL FIX: Prevent the button from taking focus when clicked.
                        // This allows the input to remain focused (or immediately re-focused) 
                        // without the user having to click again.
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={loading}
                        className="bg-sky-600 text-white p-2 rounded-md hover:bg-sky-700 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Chatbot;