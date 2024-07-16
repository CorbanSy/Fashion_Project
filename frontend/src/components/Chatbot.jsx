import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hi! How can I help you today?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await api.get('/profile/');
                const data = response.data;
                console.log(data); // Log the response data
                setUserName(data.name || 'User'); // Use a fallback value if name is undefined
                // Update the greeting message
                setMessages([
                    { text: `Hi ${data.name || 'User'}! How can I help you today?`, sender: 'bot' }
                ]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();

        const handleScroll = () => {
            const chatbot = document.querySelector('.chatbot-container');
            chatbot.style.bottom = `${20 + window.scrollY}px`;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSendMessage = async () => {
        const newMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(newMessages);
        setInput('');

        const response = await getResponseFromOpenAI(input);
        setMessages([...newMessages, { text: response, sender: 'bot' }]);
    };

    const getResponseFromOpenAI = async (input) => {
        try {
            const response = await fetch('https://api.openai.com/v1/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_OPENAI_API_KEY`
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
