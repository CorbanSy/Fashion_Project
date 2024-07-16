import React, { useState, useEffect} from "react";
import '../styles/FashionAdviceChatbot.css';

const FashionAdviceChatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hi! How can I help you with fashion advice today?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        const response = await getFashionAdvice(input);
        setMessages([...newMessages, { text: response, sender: 'bot' }]);
    };

    const getFashionAdvice = async (input) => {
        try {
            const response = await fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_OPENAI_API_KEY`
                },
                body: JSON.stringify({
                    model: 'text-davinci-003',
                    prompt: `Give me fashion advice: ${input}`,
                    max_tokens: 150,
                })
            });

            const data = await response.json();
            return data.choices[0].text.trim();
        } catch (error) {
            console.error('Error getting fashion advice:', error);
            return 'Sorry, I\'m having trouble providing fashion adivce right now. Please try again later.';
        }
    };

    return (
        <div className="fashion-advice-chatbot-container">
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chatbot-message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="chatbot-input">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default FashionAdviceChatbot;