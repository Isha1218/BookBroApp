import React, { useEffect, useRef, useCallback, useState } from "react";
import ePub from "epubjs";
import BottomBar from "./Tabs/BottomBar";
import TopBar from "./Tabs/TopBar";
import SelectionMenu from "./Tabs/SelectionMenu";
import ViewFeatureModal from "./Modals/ViewFeatureModal";
import { addHighlight, getHighlights } from "../../api/database/HighlightsApi";
import { useSearchParams } from "react-router-dom";
import { AWS_S3_URI_BASE } from "../../consts/consts";

const EpubRenderer = () => {
  const [searchParams] = useSearchParams();
  const file = searchParams.get('file');
  const title = searchParams.get('title');
  const startCfi = searchParams.get('currCfi');
  const bookId = parseInt(searchParams.get('bookId'), 10);

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
  const isResizing = useRef(false);

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
  const [currentCfi, setCurrentCfi] = useState("");
  const [isLoadingBook, setIsLoadingBook] = useState(true);

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
    setIsTextSelected(false);
    setSelectedText("");
    setSelectedCfiRange("");
    setShowSelectionMenu(false);
    setShowBar(false);
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
    console.log('this is the book url ' + file)
    const url =
      AWS_S3_URI_BASE + file

    bookRef.current = ePub(url);

    renditionRef.current = bookRef.current.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      allowScriptedContent: true,
      flow: "paginated",
      spread: "none",
    });

    console.log('this is currCfi', startCfi)

    const updateTocIndex = (location) => {
      if (!location || !location.start || !tocRef.current) return;
      
      const href = location.start.href?.replace(/#.*/, "");
      if (href) {
        const index = tocRef.current.findIndex((item) =>
          item.href?.replace(/#.*/, "")?.endsWith(href)
        );
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    };

    const initializeBook = async () => {
      try {
        if (startCfi === '') {
          await renditionRef.current.display();
        } else {
          await renditionRef.current.display(startCfi);
          await new Promise(resolve => setTimeout(resolve, 50));
          // we have have to call display twice -> it's weird
          await renditionRef.current.display(startCfi);
          const location = renditionRef.current.currentLocation();
          if (location) {
            updateTocIndex(location);
          }
        }
      } catch (error) {
        console.error('Error during initial book display:', error);
      }
    };

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

      initializeBook();

      bookRef.current.locations.generate(1600).then(() => {
        try {
          const location = renditionRef.current.currentLocation();
          if (location && location.start && location.start.cfi) {
            const progress = bookRef.current.locations.percentageFromCfi(location.start.cfi);
            if (progress !== undefined && progress !== null && !isNaN(progress)) {
              setProgress(progress * 100);
            }
            updateTocIndex(location);
          }
        } catch (error) {
          console.error('Error calculating initial progress:', error);
        }
      });
    });

    const handleRelocated = (location) => {
      if (isResizing.current) return;
      
      try {
        if (!location || !location.start || !location.start.cfi) {
          console.warn('Invalid location object in handleRelocated');
          return;
        }

        setCurrentCfi(location.start.cfi);

        if (bookRef.current && bookRef.current.locations) {
          const progress = bookRef.current.locations.percentageFromCfi(location.start.cfi);
          if (progress !== undefined && progress !== null && !isNaN(progress)) {
            setProgress(progress * 100);
          }
        }

        updateTocIndex(location);
      } catch (error) {
        console.error('Error in handleRelocated:', error);
      }
    };

    renditionRef.current.on("selected", async (cfiRange) => {
      if (isResizing.current) return;
      
      setIsTextSelected(true);
      setSelectedCfiRange(cfiRange);
      console.log("Text selected:", cfiRange);

      try {
        const range = await bookRef.current.getRange(cfiRange);
        const selectedText = range?.toString().trim() || "";
        setSelectedText(selectedText);
      } catch (err) {
        console.error("Error extracting selected text:", err);
        setIsTextSelected(false);
        setSelectedText("");
        setSelectedCfiRange("");
      }
    });

    renditionRef.current.on("rendered", async () => {
      // Hide loading when book is fully rendered
      setIsLoadingBook(false);
      
      const iframe = viewerRef.current.querySelector("iframe");
      if (iframe) {
        iframe.contentDocument.addEventListener("mouseup", () => {
          const selection = iframe.contentWindow.getSelection();
          if (!selection || selection.toString().trim() === "") setIsTextSelected(false);
        });

        try {
          const highlights = await getHighlights(1); // change to actual bookId
          console.log('these are the highlights', highlights)
          highlights.forEach(h => {
            if (!highlightIds.current.has(h.id)) {
              try {
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
                highlightIds.current.add(h.id);
              } catch (error) {
                console.error('Error adding highlight:', h.id, error);
              }
            }
          });
        } catch (error) {
          console.error('Error loading highlights:', error);
        }
      }
    });

    renditionRef.current.on("relocated", handleRelocated);
    renditionRef.current.on("touchstart", handleTouchStart);
    renditionRef.current.on("touchend", handleTouchEnd);

    const applyFontSize = () => {
      if (!renditionRef.current) return;
      
      isResizing.current = true;
      
      try {
        const fontSize = getResponsiveFontSize();
        renditionRef.current.themes.default({
          body: {
            "user-select": "text !important",
            "-webkit-user-select": "text !important",
            "-webkit-touch-callout": "default !important",
            "font-size": `${fontSize}px !important`,
          },
          "::selection": { background: "rgba(255, 255, 0, 0.3)" },
          "::-moz-selection": { background: "rgba(255, 255, 0, 0.3)" },
        });
      } catch (error) {
        console.error('Error applying font size:', error);
      }
      
      setTimeout(() => {
        isResizing.current = false;
      }, 300);
    };

    applyFontSize();

    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(applyFontSize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", () => {
      setIsTextSelected(false);
      setSelectedText("");
      setSelectedCfiRange("");
      setShowSelectionMenu(false);
      
      setTimeout(applyFontSize, 500);
    });

    return () => {
      clearTimeout(resizeTimeout);
      renditionRef.current?.destroy();
      bookRef.current?.destroy();
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("orientationchange", applyFontSize);
    };
  }, [handleTouchStart, handleTouchEnd]);

  const spinnerStyle = {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #333',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
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
        {isLoadingBook && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            zIndex: 1000,
            gap: '24px'
          }}>
            <div style={spinnerStyle}></div>
            <div style={{
              textAlign: 'center',
              color: '#666'
            }}>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 8px 0'
              }}>
                Opening "{title || 'Book'}"
              </p>
              <p style={{
                fontSize: '14px',
                margin: 0,
                opacity: 0.8
              }}>
                Please wait while we prepare your reading experience...
              </p>
            </div>
          </div>
        )}

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
            title={title}
          />
        )}
        <BottomBar
          position={progress}
          showBar={showBar}
          currentCfi={currentCfi}
          bookId={bookId}
        />
      </div>
    </>
  );
};

export default EpubRenderer;