import React, { useState, useRef, useEffect } from "react";
import { LuSend, LuArrowLeft } from "react-icons/lu";
import { createRoleplayScenes, createCharacterBrief, doRoleplay } from "../../../api/llm/RoleplayApi";
import extractCurrChapter from "../../../services/ExtractCurrChapter";
import extractPrevChapter from "../../../services/ExtractPrevChapter";
import extractPrevChapters from "../../../services/ExtractPrevChapters";

const CharacterCard = ({ character, onSelect }) => {
    const characterName = character?.character || character?.name || 'Unknown';
    const sceneName = character?.scene || 'No scene';

    return (
        <div 
            style={{
                padding: '20px',
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
                    border: '1px solid #e0e0e0',
                    backgroundColor: character['backgroundColor'],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {characterName.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        margin: '0 0 5px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333'
                    }}>
                        {characterName}
                    </h3>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#666',
                        lineHeight: '1.4',
                        fontStyle: "italic"
                    }}>
                        Scene: {sceneName}
                    </p>
                </div>
            </div>
        </div>
    );
};

const SceneHeader = ({ scene }) => {
    const characterName = scene?.character || 'Unknown';
    const sceneName = scene?.scene || 'No scene';

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
                    backgroundColor: scene['backgroundColor'],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {characterName.charAt(0).toUpperCase()}
                </div>
                <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#333'
                }}>
                    {characterName}
                </span>
            </div>
            <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#555',
                fontStyle: 'italic',
                lineHeight: '1.4'
            }}>
                <strong>Scene:</strong> {sceneName}
            </p>
        </div>
    );
};

const RoleplayMessage = ({ role, content, scene }) => {
    const characterName = scene?.character || 'Unknown';

    return (
        <div style={{
            display: 'flex',
            justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '15px',
            width: '100%'
        }}>
            {role !== 'user' && (
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: scene['backgroundColor'],
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
                    {characterName.charAt(0).toUpperCase()}
                </div>
            )}
            <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: role === 'user' ? 'black' : '#ececec',
                color: role === 'user' ? 'white' : 'black',
                fontSize: '14px',
                lineHeight: '1.4',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap'
            }}>
                {content}
            </div>
        </div>
    );
};

const MessageInput = ({ onSendMessage, isLoading, scene }) => {
    const [message, setMessage] = useState('');
    const characterName = scene?.character || scene?.name || 'Character';

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
                placeholder={isLoading ? `${characterName} is responding...` : `Message ${characterName}...`}
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
                <LuSend color="black"/>
            </button>
        </div>
    );
};

const Roleplay = ({ book, rendition }) => {
    const [scenes, setScenes] = useState([]);
    const [selectedScene, setSelectedScene] = useState(null);
    const [characterBrief, setCharacterBrief] = useState('');
    const [characterQuotes, setCharacterQuotes] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingScenes, setIsLoadingScenes] = useState(true); 

    const chatContainerRef = useRef(null);
    const createRoleplayScenesRef = useRef(null);

    const bgColors = [
        '#FD636B',
        '#FFB900',
        '#B1D877',
        '#1BAFD0',
    ]

    useEffect(() => {
        if (createRoleplayScenesRef.current) return;
        createRoleplayScenesRef.current = true;
        
        const fetchRoleplayScenes = async () => {
            try {
                setIsLoadingScenes(true);
                const prevChapter = await extractPrevChapter(rendition, book);
                const currChapter = await extractCurrChapter(rendition, book);
                const roleplayContext = prevChapter + currChapter;
                const scenes = await createRoleplayScenes(roleplayContext);
                
                const scenesArray = Array.isArray(scenes) ? scenes : [];

                const updatedScenes = scenesArray.map((scene, index) => ({
                    ...scene,
                    backgroundColor: bgColors[index % bgColors.length],
                }));

                setScenes(updatedScenes);
            } catch (error) {
                console.error('Error fetching roleplay scenes:', error);
                setScenes([]);
            } finally {
                setIsLoadingScenes(false);
            }
        };

        fetchRoleplayScenes();
    }, []);

    const handleSceneSelect = async (scene) => {
        try {
            setSelectedScene(scene);
            
            const characterName = scene?.character || scene?.name || 'Unknown';
            const firstDialogue = scene?.first_dialogue || scene?.firstDialogue || `Hello! I'm ${characterName}.`;
            
            const openingMessage = {
                role: characterName,
                content: firstDialogue,
            };
            setMessages([openingMessage]);

            const prevChapters = await extractPrevChapters(rendition, book);
            const currChapter = await extractCurrChapter(rendition, book);
            const readText = prevChapters + currChapter;

            const prevChapter = await extractPrevChapter(rendition, book);
            const recentChapterContext = prevChapter + currChapter;
            
            const sceneName = scene?.scene || 'current scene';
            const characterBrief = await createCharacterBrief(characterName, sceneName, readText, recentChapterContext);
            
            setCharacterBrief(characterBrief?.character_brief || characterBrief?.characterBrief || '');
            setCharacterQuotes(characterBrief?.quotes || []);
        } catch (error) {
            console.error('Error selecting scene:', error);
        }
    };

    const handleBackToScenes = () => {
        setSelectedScene(null);
        setMessages([]);
        setCharacterBrief('');
        setCharacterQuotes([]);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (messageText) => {
        try {
            const userMessage = {
                role: 'user',
                content: messageText,
            };
            
            setMessages(prev => [...prev, userMessage]);
            setIsLoading(true);

            const currChapter = await extractCurrChapter(rendition, book);
            const prevChapter = await extractPrevChapter(rendition, book);
            const recentChapterContext = prevChapter + currChapter;
            
            const characterName = selectedScene?.character || selectedScene?.name || 'Unknown';
            const sceneName = selectedScene?.scene || 'current scene';
            
            const roleplayMessage = await doRoleplay(
                characterName, 
                characterBrief, 
                sceneName, 
                recentChapterContext, 
                characterQuotes, 
                [...messages, userMessage]
            );

            const botResponse = {
                role: characterName,
                content: roleplayMessage,
            };
            
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error sending message:', error);
            // Optionally add error message to chat
            const errorMessage = {
                role: 'system',
                content: 'Sorry, there was an error processing your message.',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state for scenes
    if (isLoadingScenes) {
        return (
            <div style={{ 
                width: "95%", 
                height: "100%",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: '#666' }}>Loading roleplay scenes...</p>
                </div>
            </div>
        );
    }

    // Scene selection view
    if (!selectedScene) {
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
                
                {scenes.length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#999', fontStyle: 'italic' }}>
                        No scenes available. Try reading more of the book first.
                    </p>
                ) : (
                    scenes.map((scene, index) => {
                        const characterName = scene?.character || scene?.name || 'Unknown';
                        return (
                            <CharacterCard
                                key={`${characterName}-${index}`}
                                character={scene}
                                onSelect={handleSceneSelect}
                            />
                        );
                    })
                )}
            </div>
        );
    }

    // Chat view
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
                    onClick={handleBackToScenes}
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
                    {selectedScene?.character || selectedScene?.name || 'Character'}
                </p>
            </div>
            
            <SceneHeader scene={selectedScene}/>
            
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
                {messages.map((message, index) => (
                    <RoleplayMessage
                        key={`message-${index}`}
                        role={message.role}
                        content={message.content}
                        scene={selectedScene}
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
                            backgroundColor: selectedScene['backgroundColor'],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            color: 'white',
                            fontWeight: 'bold',
                            marginRight: '10px',
                            flexShrink: 0
                        }}>
                            {(selectedScene?.character || selectedScene?.name || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            backgroundColor: '#ececec',
                            color: '#666',
                            fontSize: '14px',
                            fontStyle: 'italic'
                        }}>
                            {selectedScene?.character || selectedScene?.name || 'Character'} is typing...
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
                <MessageInput 
                    onSendMessage={handleSendMessage} 
                    isLoading={isLoading} 
                    scene={selectedScene}
                />
            </div>
        </div>
    );
};

export default Roleplay;