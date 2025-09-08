import Chat from "../Features/AskBro";
import LookUp from "../Features/LookUp";
import Recap from "../Features/Recap";
import Roleplay from "../Features/Roleplay";
import Search from "../Features/Search";
import Settings from "../Features/Settings";
import TableOfContents from "../Features/TableOfContents";
import React from "react";

const ViewFeatureModal = ({ onCloseFeatureModal, toc, onNavigate, currIndex, book, rendition, featureModalIndex, selectedText = '', title}) => {
    const features = [
        <TableOfContents toc={toc} onNavigate={onNavigate} currIndex={currIndex}/>,
        <Chat book={book} rendition={rendition}/>,
        <Recap book={book} rendition={rendition} title={title}/>,
        <Roleplay book={book} rendition={rendition}/>,
        <Search book={book} toc={toc} onNavigate={onNavigate} />,
        <LookUp book={book} rendition={rendition} selectedText={selectedText}/>
    ];

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    height: "70%",
                    width: "70%",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "start",
                    padding: "20px",
                }}
            >
                <button
                    onClick={onCloseFeatureModal}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        fontSize: "18px",
                        color: 'black'
                    }}
                >
                    ✕
                </button>
                {/* <TableOfContents toc={toc} onNavigate={onNavigate} currIndex={currIndex}/> */}
                {/* <Recap/> */}
                {/* <Search book={book} toc={toc} onNavigate={onNavigate} /> */}
                {/* <Chat/> */}
                {/* <Roleplay/> */}
                {/* <LookUp/> */}
                {features[featureModalIndex]}
            </div>
        </div>
    );
};

export default ViewFeatureModal;