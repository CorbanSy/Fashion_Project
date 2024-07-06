import React, { useState } from 'react';
import '../styles/Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hi! How can I help you today?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        // Get response from OpenAI
        const response = await getResponseFromOpenAI(input);
        setMessages([...newMessages, { text: response, sender: 'bot' }]);
    };

    const getResponseFromOpenAI = async (input) => {
        try {
            const response = await fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_OPENAI_API_KEY` // replace with your actual OpenAI API key
                },
                body: JSON.stringify({
                    model: 'text-davinci-003',
                    prompt: input,
                    max_tokens: 150,
                })
            });

            const data = await response.json();
            return data.choices[0].text.trim();
        } catch (error) {
            console.error('Error getting response from OpenAI:', error);
            return 'Sorry, I\'m having trouble understanding you right now. Please try again later.';
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <p>Examples of what to ask:</p>
                <ul>
                    <li>Where do I go to generate an outfit?</li>
                    <li>I recently lost some weight and need to change my waist measurements, how do I do that?</li>
                    <li>I want to upload a new outfit I picked out from the store today, how do I do that?</li>
                </ul>
            </div>
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

export default Chatbot;
