import React, { useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { addBook } from "../../api/database/BooksApi";

const TopBar = ({ userId, onUploadSuccess }) => {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileClick = () => {
        if (isUploading) return; // Prevent clicking while uploading
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            const ePubModule = await import("epubjs");
            const ePubConstructor = ePubModule.default || ePubModule;
            const arrayBuffer = await selectedFile.arrayBuffer();
            const book = ePubConstructor(arrayBuffer);
            await book.ready;

            const title = book.packaging.metadata.title || "";
            const author = book.packaging.metadata.creator || "";

            let coverFile = null;
            try {
                const coverUrl = await book.coverUrl();
                if (coverUrl) {
                    coverFile = await fetch(coverUrl).then((res) => res.blob());
                }
            } catch (e) {
                console.warn("No cover found:", e);
            }
            
            const data = await addBook(title, author, 1, selectedFile, coverFile);
            console.log("Uploaded:", data);

            if (onUploadSuccess) await onUploadSuccess();
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
            // Reset the file input so the same file can be selected again if needed
            event.target.value = '';
        }
    };

    const spinnerStyle = {
        width: '20px',
        height: '20px',
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #333',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    const keyframes = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    return (
        <div style={{
            margin: '20px 40px'
        }}>
            <style>{keyframes}</style>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <p style={{
                    fontWeight: '600',
                    fontSize: '24px',
                    wordSpacing: '4px',
                    margin: 0,
                }}>My Books</p>

                <input
                    type="file"
                    accept=".epub"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    disabled={isUploading}
                />

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    {isUploading && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#666'
                        }}>
                            <div style={spinnerStyle}></div>
                            <span>Adding book...</span>
                        </div>
                    )}
                    
                    <button 
                        style={{ 
                            all: "unset", 
                            cursor: isUploading ? "not-allowed" : "pointer",
                            opacity: isUploading ? 0.5 : 1,
                            transition: 'opacity 0.2s ease'
                        }}
                        onClick={handleFileClick}
                        disabled={isUploading}
                    >
                        <AiOutlinePlus fontSize={24}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;