import React, { useEffect, useRef, useCallback, useState } from "react";
import ePub from "epubjs";
import BottomBar from "./BottomBar";
import TopBar from "./TopBar";
import SelectionMenu from "./SelectionMenu";

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
  const tapMaxDistance = 10;
  const tapMaxTime = 250;

  const [showBar, setShowBar] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ State for selection menu
  const [selectionMenuPosition, setSelectionMenuPosition] = useState(null);
  const [isSelectionMenuVisible, setIsSelectionMenuVisible] = useState(false);

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
      } catch (err) {}

      if (deltaX > 0) {
        renditionRef.current?.prev();
      } else {
        renditionRef.current?.next();
      }
      return;
    }

    if (
      Math.abs(deltaX) < tapMaxDistance &&
      Math.abs(deltaY) < tapMaxDistance &&
      touchDuration < tapMaxTime
    ) {
      setShowBar((prev) => !prev);
      setIsSelectionMenuVisible(false); // ✅ Hide selection menu on tap
    }
  }, [swipeThreshold, verticalTolerance, swipeTimeThreshold]);

  useEffect(() => {
    if (!showBar) return;

    const timer = setTimeout(() => {
      setShowBar(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showBar]);

  useEffect(() => {
    const url =
      "https://isha1218-ebooks.s3.us-east-2.amazonaws.com/isha1218_a_court_of_silver_flames_a_court_of_thorns_and_roses_sarah_j_maas.epub";

    bookRef.current = ePub(url);

    renditionRef.current = bookRef.current.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
      flow: "paginated",
      spread: "none",
    });

    renditionRef.current.display();

    bookRef.current.ready.then(() => {
      bookRef.current.locations.generate(1600).then(() => {
        const location = renditionRef.current.currentLocation();
        const progress = bookRef.current.locations.percentageFromCfi(
          location.start.cfi
        );
        setProgress(progress * 100);
      });
    });

    const handleRelocated = (location) => {
      const progress = bookRef.current.locations.percentageFromCfi(
        location.start.cfi
      );
      setProgress(progress * 100);
    };

    renditionRef.current.on("relocated", handleRelocated);
    renditionRef.current.on("touchstart", handleTouchStart);
    renditionRef.current.on("touchend", handleTouchEnd);

    renditionRef.current.on("selected", (cfiRange, contents) => {
      const selection = contents.window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const iframe = contents.document.defaultView.frameElement;
      const iframeRect = iframe.getBoundingClientRect();

      const absoluteTop = iframeRect.top + rect.top;
      const absoluteLeft = iframeRect.left + rect.left;

      // ✅ Position menu above the selection, centered
      const viewportWidth = window.innerWidth;
      const estimatedButtonWidth = 40;
      const numberOfButtons = 4;
      const estimatedGap = viewportWidth * 0.04;
      const estimatedMenuWidth = estimatedButtonWidth * numberOfButtons + estimatedGap * (numberOfButtons - 1) + 40; // + padding

      const horizontalPadding = 20;

      const position = {
        left: Math.min(
          Math.max(absoluteLeft + rect.width / 2, estimatedMenuWidth / 2 + horizontalPadding),
          viewportWidth - estimatedMenuWidth / 2 - horizontalPadding
        ),
        top: absoluteTop - 150,
        transform: "translateX(-50%)",
      };

      setSelectionMenuPosition(position);
      setIsSelectionMenuVisible(true);
    });

    renditionRef.current.themes.default({
      body: {
        "user-select": "text !important",
        "-webkit-user-select": "text !important",
        "-webkit-touch-callout": "none !important",
        "font-size": "32px !important",
      },
      "::selection": {
        background: "rgba(255, 255, 0, 0.3)",
      },
      "::-moz-selection": {
        background: "rgba(255, 255, 0, 0.3)",
      },
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        boxSizing: "border-box",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <TopBar title={"A Court of Silver Flames"} showBar={showBar} />
      <div
        ref={viewerRef}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <SelectionMenu
        position={selectionMenuPosition}
        isVisible={isSelectionMenuVisible}
      />
      <BottomBar position={Math.round(progress) + "%"} showBar={showBar} />
    </div>
  );
};

export default EpubRenderer;
