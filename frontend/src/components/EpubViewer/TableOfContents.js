import React from "react";

const TableOfContents = ({ showTOC, onToggle, bookRef, renditionRef }) => {
  const handleChapterClick = (href) => {
    if (renditionRef?.current) {
      renditionRef.current.display(href);
    }
  };

  // Recursive function to render TOC items with subchapters
  const renderTocItem = (item, level = 0) => {
    const indentPadding = level * 20; // 20px per level
    const fontSize = level === 0 ? "14px" : "13px";
    const fontWeight = level === 0 ? "500" : "normal";
    const color = level === 0 ? "#333" : "#666";

    return (
      <div key={item.id || item.href}>
        <div
          onClick={() => handleChapterClick(item.href)}
          style={{
            padding: "8px 0",
            paddingLeft: `${indentPadding}px`,
            borderBottom: level === 0 ? "1px solid #eee" : "none",
            cursor: "pointer",
            fontSize: fontSize,
            fontWeight: fontWeight,
            lineHeight: "1.4",
            color: color,
            transition: "all 0.2s ease",
            borderLeft: level > 0 ? "2px solid #e0e0e0" : "none",
            marginLeft: level > 0 ? "10px" : "0",
          }}
          onMouseOver={(e) => {
            e.target.style.color = level === 0 ? "#000" : "#333";
            e.target.style.backgroundColor = "#f0f0f0";
          }}
          onMouseOut={(e) => {
            e.target.style.color = color;
            e.target.style.backgroundColor = "transparent";
          }}
        >
          {item.label}
        </div>
        
        {/* Render subchapters recursively */}
        {item.subitems && item.subitems.length > 0 && (
          <div>
            {item.subitems.map((subitem) => renderTocItem(subitem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          top: "20px",
          left: showTOC ? "320px" : "20px",
          zIndex: 1000,
          backgroundColor: "#333",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          cursor: "pointer",
          fontSize: "18px",
          transition: "left 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showTOC ? "x" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: showTOC ? 0 : "-28vw",
          width: "28vw",
          height: "100vh",
          backgroundColor: "white",
          borderRight: "1px solid #ddd",
          zIndex: 999,
          transition: "left 0.3s ease",
          overflowY: "auto",
          padding: "80px 20px 20px 20px",
          boxSizing: "border-box",
        }}
      >
        <h3 style={{ margin: "0 0 20px 0", color: "#333", fontSize: "18px" }}>
          Table of Contents
        </h3>
        
        <div style={{ color: "#666" }}>
          {bookRef?.current?.navigation?.toc ? (
            bookRef.current.navigation.toc.map((chapter) => renderTocItem(chapter))
          ) : (
            <div style={{ fontSize: "14px", color: "#999" }}>
              Loading table of contents...
            </div>
          )}
        </div>

        {/* Additional sidebar sections can go here */}
        <div style={{ marginTop: "30px" }}>
          <h4 style={{ margin: "0 0 15px 0", color: "#333", fontSize: "16px" }}>
            Reading Options
          </h4>
          <div style={{ fontSize: "14px", color: "#666" }}>
            <div style={{ padding: "8px 0", cursor: "pointer" }}>Bookmarks</div>
            <div style={{ padding: "8px 0", cursor: "pointer" }}>Highlights</div>
            <div style={{ padding: "8px 0", cursor: "pointer" }}>Notes</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableOfContents;