import React, { useState, useRef, useEffect } from "react";
import { LuSend } from "react-icons/lu";
import doAskBro from "../../../api/llm/AskBroApi";
import extractCurrChapter from "../../../services/ExtractCurrChapter";
import extractPrevChapters from "../../../services/ExtractPrevChapters";
import extractCurrPage from "../../../services/ExtractCurrPage";
import extractPrevChapter from "../../../services/ExtractPrevChapter";

const ChatMessage = ({ message, isUser }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '15px',
            width: '100%'
        }}>
            <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: isUser ? 'black' : '#ececec',
                color: isUser ? 'white' : 'black',
                fontSize: '14px',
                lineHeight: '1.4',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
            }}>
                {message}
            </div>
        </div>
    );
};

const MessageInput = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => setMessage(e.target.value);

    const handleSend = () => {
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{
            backgroundColor: '#ececec',
            borderRadius: '10px',
            padding: '12px 16px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px'
        }}>
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? "Bro is thinking..." : "Message Bro..."}
                style={{
                    margin: 0,
                    fontSize: '14px',
                    wordSpacing: '2px',
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    color: message ? '#000' : '#919191',
                    resize: 'none'
                }}
                disabled={isLoading}
            />
            <button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: (!message.trim() || isLoading) ? 'default' : 'pointer',
                    color: (!message.trim() || isLoading) ? '#ccc' : '#007AFF',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                }}
            >
                <LuSend color="black"/>
            </button>
        </div>
    );
};

const Chat = ({ book, rendition }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey! I'm Bro, your reading companion. Ask me anything about the book you're reading!", isUser: false }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (messageText) => {
        const userMessage = {
            id: Date.now(),
            text: messageText,
            isUser: true
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const prevChapters = await extractPrevChapters(rendition, book);
            const currChapter = await extractCurrChapter(rendition, book);
            const currPage = await extractCurrPage(rendition);
            const prevChapter = await extractPrevChapter(rendition, book);
            const askBroContext = prevChapters + currChapter + currPage;
            const recentPages = prevChapter + currChapter + currPage;
            const response = await doAskBro(messageText, recentPages, askBroContext);

            const botResponse = {
                id: Date.now() + 1,
                text: response,
                isUser: false
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                text: "Oops! Something went wrong while asking Bro.",
                isUser: false
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            width: "95%", 
            height: "100%",
            display: 'flex',
            flexDirection: 'column',
            overflowX: "hidden"
        }}>
            <p
                style={{
                fontSize: "25px",
                fontWeight: "700",
                margin: 0,
                marginBottom: "15px",
                marginTop: "15px",
                wordSpacing: "3px",
                }}
            >
                Chat with Bro
            </p>
            
            <div 
                ref={chatContainerRef}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '10px 0',
                    marginBottom: '10px',
                    minHeight: 0
                }}
            >
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message.text}
                        isUser={message.isUser}
                    />
                ))}
                
                {isLoading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginBottom: '15px'
                    }}>
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            backgroundColor: '#ececec',
                            color: '#666',
                            fontSize: '14px',
                            fontStyle: 'italic'
                        }}>
                            Bro is typing...
                        </div>
                    </div>
                )}
            </div>
            
            <div style={{
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '10px'
            }}>
                <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default Chat;
