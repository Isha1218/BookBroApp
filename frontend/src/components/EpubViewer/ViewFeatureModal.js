import TableOfContents from "./TableOfContents";
import React from "react";

const ViewFeatureModal = ({ onCloseFeatureModal, toc, onNavigate}) => {
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
                    justifyContent: "center",
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
                <TableOfContents toc={toc} onNavigate={onNavigate} />
            </div>
        </div>
    );
};

export default ViewFeatureModal;
