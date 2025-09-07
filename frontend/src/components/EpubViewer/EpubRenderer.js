import React, { useEffect, useRef, useCallback, useState } from "react";
import ePub from "epubjs";
import BottomBar from "./Tabs/BottomBar";
import TopBar from "./Tabs/TopBar";
import SelectionMenu from "./Tabs/SelectionMenu";
import ViewFeatureModal from "./Modals/ViewFeatureModal";
import { addHighlight, getHighlights } from "../../api/database/HighlightsApi";

const EpubRenderer = () => {
  const viewerRef = useRef(null);
  const bookRef = useRef(null);
  const renditionRef = useRef(null);
  const menuRef = useRef(null);
  const topBarRef = useRef(null);
  const tocRef = useRef([]);

  const isMenuTouch = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const highlightIds = useRef(new Set())

  const swipeThreshold = 30;
  const verticalTolerance = 60;
  const swipeTimeThreshold = 500;
  const tapMaxDistance = 10;
  const tapMaxTime = 250;

  const [showBar, setShowBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectedCfiRange, setSelectedCfiRange] = useState("");
  const [showSelectionMenu, setShowSelectionMenu] = useState(false);
  const [featureModalIndex, setFeatureModalIndex] = useState(-1);
  const [toc, setToc] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getResponsiveFontSize = () => {
    const width = window.innerWidth;
    const minWidth = 320;
    const maxWidth = 1024;
    const minFont = 20;
    const maxFont = 32;

    if (width <= minWidth) return minFont;
    if (width >= maxWidth) return maxFont;

    return minFont + ((width - minWidth) / (maxWidth - minWidth)) * (maxFont - minFont);
  };

  const handleNavigate = useCallback(async (target) => {
    if (!renditionRef.current || !bookRef.current) {
      return;
    }
  
    try {
      await bookRef.current.ready;
      await renditionRef.current.display(target);
      await new Promise(resolve => setTimeout(resolve, 50));
      // we have to call twice to display correctly -> it's weird
      await renditionRef.current.display(target);
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }, []);

  const handleShowFeatureModal = useCallback((index) => {
    setFeatureModalIndex(index);
  }, []);


  const handleCloseFeatureModal = useCallback(() => {
    setFeatureModalIndex(-1);
  }, []);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = e.timeStamp;

    if (
      (menuRef.current && menuRef.current.contains(e.target)) ||
      (topBarRef.current && topBarRef.current.contains(e.target))
    ) {
      isMenuTouch.current = true;
    } else {
      isMenuTouch.current = false;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (isMenuTouch.current) return;

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
          if (selection && selection.toString().length > 0) return;
        } catch (err) {}

        if (deltaX > 0) renditionRef.current?.prev();
        else renditionRef.current?.next();
        return;
      }

      if (
        Math.abs(deltaX) < tapMaxDistance &&
        Math.abs(deltaY) < tapMaxDistance &&
        touchDuration < tapMaxTime
      ) {
        setShowBar((prev) => !prev);
      }
    },
    [swipeThreshold, verticalTolerance, swipeTimeThreshold]
  );

  const handleHighlight = useCallback(async () => {
    console.log("handle highlight called");
    if (!selectedCfiRange || !selectedText || !bookRef.current || !renditionRef.current) {
      return;
    }

    console.log("cfi range", selectedCfiRange)
    console.log("selected text", selectedText)

    try {
      const hId = await addHighlight(1, 1, selectedCfiRange, selectedText); // change to actual bookId and userId
      renditionRef.current.annotations.add(
        "highlight",
        selectedCfiRange, 
        {
          fill: "yellow",
          fillOpacity: "0.4",
          mixBlendMode: "multiply"
        }, 
        () => {
          console.log("Highlight added")
        },
        hId
      );
      setIsTextSelected(false);
      setSelectedText("");
      setSelectedCfiRange("");
      setFeatureModalIndex(-1);
    } catch (error) {
      console.error("Error adding highlight:", error);
    }
  }, [selectedCfiRange, selectedText])

  useEffect(() => {
    if (!showBar) return;
    const timer = setTimeout(() => setShowBar(false), 5000);
    return () => clearTimeout(timer);
  }, [showBar]);

  useEffect(() => {
    if (isTextSelected) setTimeout(() => setShowSelectionMenu(true), 50);
    else setShowSelectionMenu(false);
  }, [isTextSelected]);

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
      const navigation = bookRef.current.navigation;
      setToc(navigation.toc);

      const flatToc = [];
      const flattenToc = (items) => {
        items.forEach((item) => {
          flatToc.push(item);
          if (item.subitems && item.subitems.length > 0) {
            flattenToc(item.subitems);
          }
        });
      };
      flattenToc(navigation.toc);
      tocRef.current = flatToc;

      bookRef.current.locations.generate(1600).then(() => {
        const location = renditionRef.current.currentLocation();
        const progress = bookRef.current.locations.percentageFromCfi(location.start.cfi);
        setProgress(progress * 100);
      });
    });

    const handleRelocated = (location) => {
      const progress = bookRef.current.locations.percentageFromCfi(location.start.cfi);
      setProgress(progress * 100);

      const href = location.start.href.replace(/#.*/, "");
      const index = tocRef.current.findIndex((item) =>
        item.href.replace(/#.*/, "").endsWith(href)
      );

      if (index !== -1) setCurrentIndex(index);
    };

    renditionRef.current.on("selected", async (cfiRange) => {
      setIsTextSelected(true);
      setSelectedCfiRange(cfiRange);
      console.log("Text selected:", cfiRange);

      try {
        const range = await bookRef.current.getRange(cfiRange);
        const selectedText = range?.toString().trim() || "";
        setSelectedText(selectedText);
      } catch (err) {
        console.error("Error extracting selected text:", err);
      }
    });

    renditionRef.current.on("rendered", async () => {
      const iframe = viewerRef.current.querySelector("iframe");
      if (iframe) {
        iframe.contentDocument.addEventListener("mouseup", () => {
          const selection = iframe.contentWindow.getSelection();
          if (!selection || selection.toString().trim() === "") setIsTextSelected(false);
        });

        const highlights = await getHighlights(1); // change to actual bookId
        console.log('these are the highlights', highlights)
        highlights.forEach(h => {
          if (!highlightIds.current.has(h.id)) {
            renditionRef.current.annotations.add(
              "highlight",
              h.cfiRange,
              {
                fill: "yellow",
                fillOpacity: "0.4",
                mixBlendMode: "multiply"
              },
              (e) => console.log('Highlight added'),
              h.id
            );
            highlightIds.current.add(h.id)
          }
        })
      }
    });

    renditionRef.current.on("relocated", handleRelocated);

    renditionRef.current.on("touchstart", handleTouchStart);
    renditionRef.current.on("touchend", handleTouchEnd);

    const applyFontSize = () => {
      const fontSize = getResponsiveFontSize();
      renditionRef.current?.themes.default({
        body: {
          "user-select": "text !important",
          "-webkit-user-select": "text !important",
          "-webkit-touch-callout": "default !important",
          "font-size": `${fontSize}px !important`,
        },
        "::selection": { background: "rgba(255, 255, 0, 0.3)" },
        "::-moz-selection": { background: "rgba(255, 255, 0, 0.3)" },
      });
    };

    applyFontSize();

    window.addEventListener("resize", applyFontSize);

    return () => {
      renditionRef.current?.destroy();
      bookRef.current?.destroy();
      window.removeEventListener("resize", applyFontSize);
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
      {isTextSelected ? (
        <SelectionMenu ref={menuRef} showBar={showSelectionMenu} onShowFeatureModal={handleShowFeatureModal} onHighlight={handleHighlight}/>
      ) : (
        <TopBar ref={topBarRef} showBar={showBar} onShowFeatureModal={handleShowFeatureModal} />
      )}

      <div
        ref={viewerRef}
        style={{
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      {featureModalIndex != -1 && (
        <ViewFeatureModal
          onCloseFeatureModal={handleCloseFeatureModal}
          toc={toc}
          onNavigate={handleNavigate}
          currIndex={currentIndex}
          book={bookRef.current}
          rendition={renditionRef.current}
          featureModalIndex={featureModalIndex}
          selectedText={selectedText}
        />
      )}
      <BottomBar
        position={Math.round(progress) + "%"}
        showBar={showBar}
      />
    </div>
  );
};

export default EpubRenderer;