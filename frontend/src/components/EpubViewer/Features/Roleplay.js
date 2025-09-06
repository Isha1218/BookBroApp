import React, { useState, useRef, useEffect } from "react";
import { LuSend, LuArrowLeft } from "react-icons/lu";
import createRoleplayScenes from "../../../api/llm/RoleplayApi";
import extractCurrChapter from "../../../services/ExtractCurrChapter";
import extractPrevChapter from "../../../services/ExtractPrevChapter";
import { IoColorWandSharp } from "react-icons/io5";

const CharacterCard = ({ character, backgroundColor, onSelect }) => {

    return (
        <div 
            style={{
                padding: '20px',
                // backgroundColor: '#f8f8f8',
                borderRadius: '12px',
                margin: '10px 0',
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
            }}
            onClick={() => onSelect(character)}
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {character['character'].charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        margin: '0 0 5px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333'
                    }}>
                        {character['character']}
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.4',
                        fontStyle: "italic"
                    }}>
                        Scene: {character['scene']}
                    </p>
                </div>
            </div>
        </div>
    );
};

const SceneHeader = ({ scene, character }) => {
    return (
        <div style={{
            backgroundColor: '#f0f4f8',
            padding: '15px',
            borderRadius: '10px',
            margin: '0 0 15px 0',
            border: '1px solid #e0e8f0'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px'
            }}>
                <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: character.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {character.name.charAt(0)}
                </div>
                <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333'
                }}>
                    {character.name}
                </span>
            </div>
            <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#555',
                fontStyle: 'italic',
                lineHeight: '1.4'
            }}>
                <strong>Scene:</strong> {scene}
            </p>
        </div>
    );
};

const RoleplayMessage = ({ message, isUser, character }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '15px',
            width: '100%'
        }}>
            {!isUser && (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: character.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: '10px',
                    flexShrink: 0,
                    alignSelf: 'flex-end'
                }}>
                    {character.name.charAt(0)}
                </div>
            )}
            <div style={{
                maxWidth: '75%',
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

const MessageInput = ({ onSendMessage, isLoading, character }) => {
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

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
                placeholder={isLoading ? `${character.name} is responding...` : `Message ${character.name}...`}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
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
                <LuSend />
            </button>
        </div>
    );
};

const Roleplay = ({ currentBookProgress = 45, book, rendition }) => {

    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentScene, setCurrentScene] = useState('');
    const chatContainerRef = useRef(null);
    const createRoleplayScenesRef = useRef(null);
    const [scenes, setScenes] = useState([]);
    const [characterColors, setCharacterColors] = useState({});

    const getCharacterColor = () => {
        const randomHex = Math.floor(Math.random() * 16777215).toString(16);
        const paddedHex = '#' + randomHex.padStart(6, '0'); 
        return paddedHex
    };

    useEffect(() => {
        if (createRoleplayScenesRef.current) return;
        createRoleplayScenesRef.current = true;
        
        const fetchRoleplayScenes = async () => {
          const prevChapter = await extractPrevChapter(rendition, book);
          const currChapter = await extractCurrChapter(rendition, book);
          const roleplayContext = prevChapter + currChapter;
          const scenes = await createRoleplayScenes(roleplayContext)
          setScenes(scenes)

          const colors = {}
          scenes.forEach((character) => {
            colors[character['character']] = getCharacterColor()
          })
          setCharacterColors(colors)
        };
    
        fetchRoleplayScenes();
      }, []);

    const getSceneForProgress = (character, progress) => {
        if (progress < 30) return character.scenes.early;
        if (progress < 70) return character.scenes.mid;
        return character.scenes.late;
    };

    const handleCharacterSelect = (character) => {
        setSelectedCharacter(character);
        const scene = getSceneForProgress(character, currentBookProgress);
        setCurrentScene(scene);
        
        // Initialize conversation with character's opening message
        const openingMessage = {
            id: 1,
            text: getOpeningMessage(character, scene),
            isUser: false
        };
        setMessages([openingMessage]);
    };

    const getOpeningMessage = (character, scene) => {
        const openingMessages = {
            'nesta': "What do you want? I'm not in the mood for company right now.",
            'cassian': "Hey there. Ready for some training, or are you here to chat?",
            'azriel': "*Steps out from the shadows* You're looking for me?",
            'rhysand': "Well, well. What brings you to seek an audience with me?"
        };
        return openingMessages[character.id] || "Hello there.";
    };

    const handleBackToCharacters = () => {
        setSelectedCharacter(null);
        setMessages([]);
        setCurrentScene('');
    };

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

        setTimeout(() => {
            const responses = {
                'nesta': [
                    "Don't expect me to go easy on you just because you're being nice.",
                    "I've been through worse than you can imagine. This is nothing.",
                    "Fine. But only because I have nothing better to do.",
                    "You're more persistent than most. I'll give you that."
                ],
                'cassian': [
                    "Ha! I like your spirit. Reminds me of someone I know.",
                    "Alright, let's see what you're made of then.",
                    "You've got potential, I'll admit that much.",
                    "Trust me, I know a thing or two about overcoming challenges."
                ],
                'azriel': [
                    "*His shadows seem to whisper secrets only he can hear*",
                    "There's more to this situation than meets the eye.",
                    "I've been watching. You handle yourself better than expected.",
                    "Some truths are better discovered than told."
                ],
                'rhysand': [
                    "Interesting perspective. I hadn't considered that angle.",
                    "You speak with wisdom beyond your years, I must say.",
                    "Power is nothing without the will to use it responsibly.",
                    "The Night Court values those who think before they act."
                ]
            };

            const characterResponses = responses[selectedCharacter.id] || ["That's interesting."];
            const randomResponse = characterResponses[Math.floor(Math.random() * characterResponses.length)];

            const botResponse = {
                id: Date.now() + 1,
                text: randomResponse,
                isUser: false
            };
            
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1500);
    };

    if (!selectedCharacter) {
        return (
            <div style={{ 
                width: "95%", 
                height: "100%",
                overflowY: "auto", 
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
                    Roleplay
                </p>
                
                <p style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: '0 0 20px 0',
                    lineHeight: '1.4'
                }}>
                    Choose a character to talk with. The scene will be set based on your current reading progress.
                </p>
                
                {scenes.map((character) => {
                    const backgroundColor = characterColors[character['character']];
                    return (
                    <CharacterCard
                        key={character['character']}
                        character={character}
                        backgroundColor={backgroundColor}
                        onSelect={handleCharacterSelect}
                    />
                )})}
            </div>
        );
    }

    return (
        <div style={{ 
            width: "95%", 
            height: "100%",
            display: 'flex',
            flexDirection: 'column',
            overflowX: "hidden"
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
                marginTop: '15px',
            }}>
                <button
                    onClick={handleBackToCharacters}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                        color: '#007AFF',
                        marginRight: '15px',
                        padding: '5px'
                    }}
                >
                    <LuArrowLeft color="black"/>
                </button>
                <p
                    style={{
                    fontSize: "25px",
                    fontWeight: "700",
                    margin: 0,
                    wordSpacing: "3px",
                    }}
                >
                    {selectedCharacter.name}
                </p>
            </div>
            
            <SceneHeader scene={currentScene} character={selectedCharacter} />
            
            {/* Chat Messages Container */}
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
                    <RoleplayMessage
                        key={message.id}
                        message={message.text}
                        isUser={message.isUser}
                        character={selectedCharacter}
                    />
                ))}
                
                {isLoading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                        marginBottom: '15px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: selectedCharacter.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            color: 'white',
                            fontWeight: 'bold',
                            marginRight: '10px',
                            flexShrink: 0
                        }}>
                            {selectedCharacter.name.charAt(0)}
                        </div>
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '18px',
                            backgroundColor: '#ececec',
                            color: '#666',
                            fontSize: '14px',
                            fontStyle: 'italic'
                        }}>
                            {selectedCharacter.name} is typing...
                        </div>
                    </div>
                )}
            </div>
            
            {/* Message Input - Fixed at bottom */}
            <div style={{
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '10px'
            }}>
                <MessageInput 
                    onSendMessage={handleSendMessage} 
                    isLoading={isLoading} 
                    character={selectedCharacter}
                />
            </div>
        </div>
    );
};

export default Roleplay;