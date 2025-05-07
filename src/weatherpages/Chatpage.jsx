import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useWeather } from '../WeatherContext/WeatherContext';

export default function ChatPage() {
  const { aiTone } = useWeather();
  
  console.log("aiTone prop:", aiTone);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hi there! I'm your SkySage assistant. How can I help you with the weather today?",
      timestamp: '12:10 PM'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  const getSuggestedQuestions = () => {
    const defaultQuestions = [
      "What should I wear today?",
      "Is it a good day for a picnic?",
      "Will I need an umbrella later?",
      "How's the weekend weather looking?"
    ];
    
    switch(aiTone) {
      case 'Professional':
        return [
          "What's the forecast for today's commute?",
          "Will weather conditions affect business operations?",
          "What are the expected temperatures for my meeting schedule?",
          "Should I anticipate any weather-related delays?"
        ];
      case 'Friendly':
        return [
          "Hey! Is it nice outside today?",
          "Should I pack a sweater for tonight?",
          "Any chance of catching some sun this weekend?",
          "Got any fun indoor activity ideas if it rains?"
        ];
      case 'Concise':
        return [
          "Today's forecast?",
          "Rain today?",
          "Weekend weather?",
          "Temperature high/low?"
        ];
      case 'Casual':
      default:
        return defaultQuestions;
    }
  };
  
  const suggestedQuestions = getSuggestedQuestions();
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 1) {
      const welcomeMessages = {
        'Professional': "Good day. I'm your SkySage weather assistant. How may I help you with weather information today?",
        'Friendly': "Hey there! I'm your friendly SkySage helper! What would you like to know about the weather?",
        'Concise': "SkySage assistant ready. Weather questions?",
        'Casual': "Hi there! I'm your SkySage assistant. How can I help you with the weather today?"
      };
      
      setMessages([{
        id: 1,
        sender: 'assistant',
        text: welcomeMessages[aiTone] || welcomeMessages['Casual'],
        timestamp: messages[0].timestamp
      }]);
    }
  }, [aiTone]);
  
  const getGeminiResponse = async (userPrompt) => {
    try {
      setIsLoading(true);
      
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
      
      const toneInstructions = {
        'Professional': "Use professional language. Be formal, precise and thorough in your responses. Use industry-appropriate terminology when relevant. Maintain a respectful and business-like tone.",
        'Friendly': "Be warm, conversational and approachable. Use friendly language with occasional exclamation points! Feel free to use casual expressions and show enthusiasm. Make the user feel like they're talking to a friend.",
        'Concise': "Be brief and to the point. Provide only essential information with minimal explanation. Use short sentences and direct language. Avoid unnecessary details or pleasantries.",
        'Casual': "Use a relaxed, everyday conversational style. Be helpful and informative while maintaining a casual tone. Feel free to use contractions and common expressions."
      };
      
      const toneInstruction = toneInstructions[aiTone] || toneInstructions['Casual'];
      
      const requestBody = {
        contents: [{
          parts: [{
            text: `You are SkySage, a helpful weather and location assistant.

When users ask about weather in a specific location:
1. Give the current weather information about the location.
2. Offer to help with other questions the user might have about the location or general weather topics.

TONE INSTRUCTIONS: ${toneInstruction}

Keep responses conversational, informative and engaging. Always provide some useful information rather than just stating limitations.

Here's the user query: ${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };
      
      const response = await fetch(`${url}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                          "Sorry, I couldn't generate a response. Please try again.";
                          
      return responseText;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Sorry, I encountered an error while processing your request. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timestamp = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: text,
      timestamp: timestamp
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    const geminiResponse = await getGeminiResponse(text);
    
    const assistantResponse = {
      id: messages.length + 2,
      sender: 'assistant',
      text: geminiResponse,
      timestamp: timestamp
    };
    
    setMessages(prev => [...prev, assistantResponse]);
  };
  
  const handleSuggestionClick = (question) => {
    handleSendMessage(question);
  };
  
  const handleSubmit = () => {
    handleSendMessage(inputValue);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const getChatContainerClass = () => {
    const baseClass = "flex flex-1 flex-col h-screen";
    
    switch(aiTone) {
      case 'Professional':
        return `${baseClass} bg-gray-50`;
      case 'Friendly':
        return `${baseClass} bg-blue-50`;
      case 'Concise':
        return `${baseClass} bg-gray-100`;
      case 'Casual':
      default:
        return baseClass;
    }
  };
  
  return (
    <div className={getChatContainerClass()}>
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto w-full max-w-3xl">
          {/* AI Tone indicator */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
              AI Assistant: {aiTone} Mode
            </span>
          </div>
          
          {/* Suggested questions */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="border rounded-md border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => handleSuggestionClick(question)}
              >
                {question}
              </button>
            ))}
          </div>
          
          {/* Chat messages */}
          <div className="space-y-4 pb-20">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] items-start gap-3 rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : aiTone === 'Professional' 
                      ? 'bg-gray-200' 
                      : aiTone === 'Friendly' 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                }`}>
                  {message.sender === 'assistant' && (
                    <span className="relative flex shrink-0 overflow-hidden h-8 w-8">
                      {/* Gemini logo SVG */}
                      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="#8E75D2" />
                        <path d="M16 6L6 12V22L16 28L26 22V12L16 6Z" fill="#FFFFFF" />
                        <path d="M16 10L10 14V20L16 24L22 20V14L16 10Z" fill="#8E75D2" />
                      </svg>
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className="mt-1 text-right text-xs opacity-70">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] items-start gap-3 rounded-lg p-3 bg-gray-100">
                  <span className="relative flex shrink-0 overflow-hidden h-8 w-8 animate-pulse">
                    {/* Gemini logo SVG */}
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                      <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="#8E75D2" />
                      <path d="M16 6L6 12V22L16 28L26 22V12L16 6Z" fill="#FFFFFF" />
                      <path d="M16 10L10 14V20L16 24L22 20V14L16 10Z" fill="#8E75D2" />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>
        </div>
      </div>
      
      {/* Message input fixed at bottom - REDESIGNED */}
      <div className="border-t border-gray-300 bg-white p-[11.25px]">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <div className="relative flex-1">
            <input
              className="w-full rounded-lg border border-gray-300 bg-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              placeholder={aiTone === 'Concise' ? "Ask question..." : "Ask about the weather..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}