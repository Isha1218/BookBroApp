import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { addBook } from "../../api/database/BooksApi";

const TopBar = ({ userId, onUploadSuccess }) => {
    const fileInputRef = useRef(null);

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

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

            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <p style={{
                fontWeight: 'bold',
                fontSize: '24px',
                wordSpacing: '4px'
            }}>My Books</p>

            <input
                type="file"
                accept=".epub"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            <button 
                style={{ all: "unset", cursor: "pointer" }}
                onClick={handleFileClick}
            >
                <AiOutlinePlus fontSize={24}/>
            </button>
        </div>
    );
};

export default TopBar;
