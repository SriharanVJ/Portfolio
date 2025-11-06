import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send } from 'lucide-react';

// Ensure this is the RAW URL, typically starting with raw.githubusercontent.com
const SRIHARAN_IMAGE_URL = 'https://raw.githubusercontent.com/SriharanVJ/Portfolio/main/Sriharan%20Photo.jpg'; 

// Set the base URL for your FastAPI server
const FASTAPI_URL = 'http://localhost:8000'; 

interface BotResponseData {
  response_text: string;
  audio_url: string; 
}

// **Constant for the desired timeout in milliseconds**
const CHATBOT_TIMEOUT_MS = 12000; 

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]); 
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // State for the error/maintenance popup
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false); 

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

  /**
   * Utility function to format raw text (especially structured lists like educational background) 
   * into clean, structured HTML for better rendering in the chat bubble.
   * Includes logic to convert **bolded** text to UPPERCASE.
   */
  const formatBotResponse = (text: string) => {
    // Check if the content looks like structured text based on multiple line breaks
    if (text.trim().includes('\n')) {
        
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        let currentListItems: string[] = [];
        const listMarkers = /^\s*[\*\-]/m;

        lines.forEach(line => {
            let content = line.trim();
            
            // 1. Convert markdown bold (**word**) to UPPERCASE and remove the markers.
            content = content.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1.toUpperCase());

            // 2. Remove list markers (* or -) and any remaining raw double asterisks (if any were missed).
            content = content.replace(listMarkers, '').replace(/\*\*/g, '').trim(); 

            if (content.length === 0) return;

            // Heuristically detect major headings (Bachelor, Diploma, etc.) 
            if (content.toLowerCase().includes('bachelor') || 
                content.toLowerCase().includes('diploma') ||
                content.toLowerCase().includes('sslc')) {
                
                // Close previous list if any, start a new bold heading
                if (currentListItems.length > 0 && currentListItems[currentListItems.length - 1].startsWith('<li')) {
                    currentListItems.push('</ul>');
                }
                // Use a proper bold heading (class "text-white font-bold")
                currentListItems.push(`<p class="mt-2 text-white font-bold">${content}</p><ul class="list-none space-y-0.5">`);
            } else {
                // Treat other lines as details using the styled bullet point
                currentListItems.push(`<li class="ml-2 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-blue-400 before:font-bold before:text-lg">${content}</li>`);
            }
        });

        // Ensure the last list is closed
        if (currentListItems.length > 0 && currentListItems[currentListItems.length - 1].startsWith('<li')) {
            currentListItems.push('</ul>');
        }
        
        // Wrap the final content in a container div
        return `<div class="p-1">${currentListItems.join('')}</div>`;
    }
    
    // Default to wrapping simple text in a paragraph tag
    return `<p>${text}</p>`;
  };


  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, `User: ${userMessage}`]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post<BotResponseData>(
        `${FASTAPI_URL}/chat`, 
        { user_input: userMessage },
        // **1. Add the timeout configuration to the axios request**
        { timeout: CHATBOT_TIMEOUT_MS } 
      );

      const { response_text, audio_url } = response.data;
      
      const botResponse = response_text || 'An unexpected error occurred in the bot.'; 
      setMessages(prev => [...prev, `Bot: ${botResponse}`]);
      
      if (audio_url) {
        playAudio(audio_url);
      }

    } catch (error) {
      console.error('Error fetching chat response:', error);
      
      // **2. Check if the error is due to a request timeout (or other connectivity issues)**
      // The condition checks for a specific axios error code ('ECONNABORTED' or similar in older versions) 
      // or if the error indicates no response was received (e.g., server offline, CORS issue, or timeout)
      const isTimeoutOrConnectionError = axios.isAxiosError(error) && 
        (error.code === 'ECONNABORTED' || !error.response);
      
      if (isTimeoutOrConnectionError) {
          // **3. Fallback message shown in chat history after the 2s timeout is hit**
          setMessages(prev => [...prev, "Bot: Oops! The bot’s off getting a software spa treatment. Try again after it feels smarter!💆‍♂️😂"]);
          // **4. Open the custom maintenance popup**
          setIsErrorPopupOpen(true); 
      } else {
          // Handle other errors (e.g., 4xx, 5xx status codes received from the server)
          setMessages(prev => [...prev, "Bot: Something went wrong on the server side. Please try again later."]);
      }
      
    } finally {
      setLoading(false);
      // Ensure focus is restored after the response
      inputRef.current?.focus(); 
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-[9999]"> 
        
        {/* Chat Toggle Button - Pure Black background */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="
                w-14 h-14 rounded-full bg-black text-white shadow-lg 
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

        {/* Chat Window Container - Pure Black background, blue text */}
        {isOpen && (
            <div 
                className="
                    absolute bottom-0 right-0 transform translate-y-[-70px] 
                    w-80 h-[450px] bg-black text-blue-400 rounded-lg 
                    shadow-2xl flex flex-col overflow-hidden border border-gray-700
                "
            >
                {/* Maintenance Popup / Modal */}
                {isErrorPopupOpen && (
                    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-4 z-20 rounded-lg">
                        {/* Using the user's image as the icon */}
                        <div className="w-20 h-20 rounded-full border-4 border-blue-600 mb-4 overflow-hidden">
                             <img src={SRIHARAN_IMAGE_URL} alt="Bot Icon" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-white text-xl font-bold text-center mb-2 font-serif">
                            System Maintenance
                        </p>
                        <p className="text-blue-400 text-center text-sm font-mono mb-6">
                            The chatbot backend is temporarily offline. 
                            <br />
                            It will be back online soon!
                        </p>
                        <button
                            onClick={() => setIsErrorPopupOpen(false)}
                            className="bg-blue-600 text-white p-2 px-4 rounded-md hover:bg-blue-700 transition font-mono"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
                
                {/* Chat Header - Changed to font-serif, text-xl, and font-bold */}
                <div className="p-3 bg-black text-blue-400 font-serif text-xl font-bold flex justify-between items-center border-b border-gray-700">
                    Chat with Sriharan's Bot
                    <button onClick={() => setIsOpen(false)} className="text-blue-400/80 hover:text-blue-300">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Messages Area - Dark Gray background for message history (slight differentiation) */}
                <div ref={messagesEndRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-900">
                    {messages.length === 0 && (
                        <p className="text-blue-400/70 text-sm">Hello! I'm Sriharan Personel Bot. Ask something about my Boss</p>
                    )}
                    {messages.map((msg, index) => {
                        const isBotMessage = msg.startsWith('Bot:');
                        const content = msg.replace('User: ', '').replace('Bot: ', '');

                        return (
                            // Message Bubbles
                            <div 
                                key={index} 
                                className={`max-w-[85%] p-2 rounded-lg text-sm ${
                                    isBotMessage 
                                        ? 'mr-auto bg-gray-800 text-blue-400 font-mono'
                                        : 'ml-auto bg-blue-600 text-white' 
                                }`}
                            >
                                {/* Apply formatting ONLY to bot messages */}
                                {isBotMessage ? (
                                    // ⚠️ Using dangerouslySetInnerHTML to render the formatted HTML
                                    <div dangerouslySetInnerHTML={{ __html: formatBotResponse(content) }} />
                                ) : (
                                    // User messages are rendered as plain text
                                    content
                                )}
                            </div>
                        );
                    })}
                    {loading && (
                         <div className="text-center text-sm text-blue-400/70">Bot is typing...</div>
                    )}
                </div>
                
                {/* Chat Input */}
                <div className="p-3 border-t border-gray-700 flex gap-2">
                    <input
                        ref={inputRef} 
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={loading || isErrorPopupOpen}
                        // Input focus ring changed to blue
                        className="flex-1 p-2 border border-gray-600 rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                    />
                    {/* Send Button - Upgraded to look smarter/circular with icon */}
                    <button 
                        onClick={sendMessage} 
                        onMouseDown={(e) => e.preventDefault()}
                        disabled={loading || isErrorPopupOpen}
                        className="
                            bg-blue-600 text-white p-3 rounded-full shadow-lg border border-blue-400
                            hover:bg-blue-700 hover:scale-105 transition duration-200 ease-in-out
                            flex items-center justify-center disabled:opacity-50
                        "
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Chatbot;