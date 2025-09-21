import React, { useEffect, useRef, useState } from "react";
import extractPrevChapters from "../../../services/ExtractPrevChapters";
import extractCurrChapter from "../../../services/ExtractCurrChapter";
import extractCurrPage from "../../../services/ExtractCurrPage";
import doLookUp from "../../../api/llm/LookUpApi";

const LookUp = ({ selectedText, book, rendition }) => {
    const [lookUpType, setLookUpType] = useState("");
    const [lookUpText, setLookUpText] = useState("");
    const [isLoading, setIsLoading] = useState(false);;

    const fetchLookUpRef = useRef(false);

    useEffect(() => {
        if (fetchLookUpRef.current) return;
        fetchLookUpRef.current = true;
        
        const fetchLookUp = async () => {
            setIsLoading(true);
            const prevChapters = await extractPrevChapters(rendition, book);
            const currChapter = await extractCurrChapter(rendition, book);
            const currPage = await extractCurrPage(rendition);
            const lookUpContext = prevChapters + currChapter + currPage;
            const { lookUpText, lookUpType } = await doLookUp(selectedText, lookUpContext);
            setLookUpText(lookUpText);
            setLookUpType(lookUpType);
            setIsLoading(false);
        };

        fetchLookUp();
    }, []);

    if (isLoading) {
        return (
            <div style={{ 
                width: "95%", 
                height: "100%",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', color: '#666' }}>Looking up {selectedText}...</p>
                </div>
            </div>
        );
    }

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
                {selectedText.charAt(0).toUpperCase() + selectedText.slice(1)}
                </p>
                <p style={{
                    margin: 0,
                    fontSize: '20px',
                    fontFamily: 'Libre Caslon Text'
                }}>
                    {lookUpType}
                </p>
            </div>
            <p
            style={{
              fontSize: "18px",
              color: "black",
              lineHeight: "1.6",
              fontFamily: "Libre Caslon Text"
            }}>
                {lookUpText}
            </p>
        </div>
      );
}

export default LookUp;