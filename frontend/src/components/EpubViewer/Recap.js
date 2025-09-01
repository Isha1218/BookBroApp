import React, { useState, useEffect } from "react";

const Recap = ({ }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const contentText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

  useEffect(() => {
    if (currentIndex < contentText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + contentText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Adjust speed here (lower = faster)
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, contentText]);

  const formatContentText = (text) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      if (paragraph.trim()) {
        return (
          <p
            key={index}
            style={{
              fontSize: "18px",
              color: "#919191",
              lineHeight: "1.6",
            }}
          >
            {paragraph}
          </p>
        );
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div style={{ width: "95%", overflowY: "auto", maxHeight: "100%" }}>
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
        Previously on <span style={{ fontStyle: "italic" }}>"A Court of Mist and Fury"</span>...
      </p>
      {formatContentText(displayedText)}
    </div>
  );
};

export default Recap;