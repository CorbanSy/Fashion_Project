import React, { useState } from 'react';
import '../styles/Chatbot.css';
import { Configuration, OpenAIapi } from 'openai';

const configuration = new Configuration({
    apiKey: 'YOUR_OPENAI_API_KEY',// replace with open API key
});

const openai = new OpenAIapi(configuration);

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hi! How can I help you today?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        //Get response from OpenAI
        const response = await getResponseFromOpenAI(input);
        setMessages([...newMessages, { text: response, sender: 'bot'}]);
    };

    const getResponseFromOpenAI = async (input) => {
        try {
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: input,
                max_tokens: 150,
            });
            return completion.data.choices[0].text.trim();
        } catch (error) {
            console.error('Error getting response from OpenAI:', error);
            return 'Sorry, I\'m having trouble understanding you right now. Please try again later.';
        }
    };

    return (
        <div className="chatbot-container">
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