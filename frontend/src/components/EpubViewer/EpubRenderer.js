import React, { useEffect, useRef, useCallback, useState } from "react";
import ePub from "epubjs";
import BottomBar from "./BottomBar";

const EpubRenderer = () => {
  const viewerRef = useRef(null);
  const bookRef = useRef(null);
  const renditionRef = useRef(null);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const swipeThreshold = 30;
  const verticalTolerance = 60;
  const swipeTimeThreshold = 500;

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = e.timeStamp;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const touchDuration = e.timeStamp - touchStartTime.current;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = Math.abs(touchEndY - touchStartY.current);

    if (
      Math.abs(deltaX) > swipeThreshold &&
      deltaY < verticalTolerance &&
      touchDuration < swipeTimeThreshold
    ) {
      try {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          return;
        }
      } catch (err) {
        // Ignore selection check errors
      }

      if (deltaX > 0) {
        renditionRef.current?.prev();
      } else {
        renditionRef.current?.next();
      }
    }
  }, [swipeThreshold, verticalTolerance, swipeTimeThreshold]);

  useEffect(() => {
    const url =
      "https://isha1218-ebooks.s3.us-east-2.amazonaws.com/isha1218_a_court_of_silver_flames_a_court_of_thorns_and_roses_sarah_j_maas.epub";

    bookRef.current = ePub(url);

    renditionRef.current = bookRef.current.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
      flow: "paginated",
      spread: "none"
    });

    renditionRef.current.display();

    renditionRef.current.on("touchstart", handleTouchStart);
    renditionRef.current.on("touchend", handleTouchEnd);

    renditionRef.current.on("selected", (cfiRange, contents) => {
      console.log("Text selected:", cfiRange);
    });

    renditionRef.current.themes.default({
      "body": {
        "user-select": "text !important",
        "-webkit-user-select": "text !important",
        "-webkit-touch-callout": "default !important",
        "font-size": "32px !important"
      },
      "::selection": {
        "background": "rgba(255, 255, 0, 0.3)"
      },
      "::-moz-selection": {
        "background": "rgba(255, 255, 0, 0.3)"
      }
    });

    return () => {
      renditionRef.current?.destroy();
      bookRef.current?.destroy();
    };
  }, [handleTouchStart, handleTouchEnd]);

  return (
    <div 
      style={{ 
        width: "100%", 
        height: "100vh", 
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        boxSizing: "border-box"
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={viewerRef}
        style={{ 
          width: "100%", 
          height: "100%", 
          overflow: "hidden",
          zIndex: 0
        }}
      />
      <BottomBar position={'6 pages left'}/>
    </div>
  );
};

export default EpubRenderer;