import React, { useState, useEffect, use } from "react";
import extractPrevChapters from "../../../services/ExtractPrevChapters";
import extractCurrPage from "../../../services/ExtractCurrPage";
import extractCurrChapter from "../../../services/ExtractCurrChapter";
import doRecap from "../../../api/llm/RecapApi";
import extractPrevChapter from "../../../services/ExtractPrevChapter";

const Recap = ({ rendition, book }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recapText, setRecapText] = useState("");

  useEffect(() => {
    const fetchRecap = async () => {
      const prevChapters = await extractPrevChapters(rendition, book);
      // const recap = await extractCurrPage(rendition);
      // const currChapter = await extractCurrChapter(rendition, book);
      // const recapContext = prevChapters + currChapter;
      // const recap = await extractPrevChapters(rendition, book);
      const prevChapter = await extractPrevChapter(rendition, book);
      const currChapter = await extractCurrChapter(rendition, book);
      const recapContext = prevChapter + currChapter;
      const recap = await doRecap(recapContext)
      setRecapText(recap);
    };

    fetchRecap();
  }, []);

  useEffect(() => {
    if (currentIndex < recapText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + recapText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, recapText]);

  const formatContentText = (text) => {
    const paragraphs = text.split('\n');
    
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