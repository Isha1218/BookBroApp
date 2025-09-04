import React, { useEffect, useRef, useState } from "react";
import extractPrevChapters from "../../../services/ExtractPrevChapters";
import extractCurrChapter from "../../../services/ExtractCurrChapter";
import extractCurrPage from "../../../services/ExtractCurrPage";
import doLookUp from "../../../api/llm/LookUpApi";

const LookUp = ({ selectedText, book, rendition }) => {
    const [lookUpType, setLookUpType] = useState("");
    const [lookUpText, setLookUpText] = useState("");

    const fetchLookUpRef = useRef(false);

    useEffect(() => {
        if (fetchLookUpRef.current) return;
        fetchLookUpRef.current = true;
        
        const fetchLookUp = async () => {
            const prevChapters = await extractPrevChapters(rendition, book);
            const currChapter = await extractCurrChapter(rendition, book);
            const currPage = await extractCurrPage(rendition);
            const lookUpContext = prevChapters + currChapter + currPage;
            const { lookUpText, lookUpType } = await doLookUp(selectedText, lookUpContext);
            setLookUpText(lookUpText);
            setLookUpType(lookUpType);
        };

        fetchLookUp();
    }, []);

    return (
        <div style={{ width: "95%", overflowY: "auto", maxHeight: "100%" }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                paddingBottom: '15px',
                borderBottom: '1px solid black'
            }}>
                <p
                style={{
                    fontSize: "50px",
                    fontWeight: "700",
                    margin: 0,
                    fontFamily: 'Libre Caslon Text'
                }}>
                {selectedText.toLowerCase()}
                </p>
                <p style={{
                    margin: 0,
                    fontSize: '20px',
                    fontFamily: 'Libre Caslon Text'
                }}>
                    {lookUpType.toLowerCase()}
                </p>
            </div>
            <p
            style={{
              fontSize: "18px",
              color: "black",
              lineHeight: "1.6",
              fontFamily: "Libre Caslon Text"
            }}>
                {lookUpText.toLowerCase()}
            </p>
        </div>
      );
}

export default LookUp;