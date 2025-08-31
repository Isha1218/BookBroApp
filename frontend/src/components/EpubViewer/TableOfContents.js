import React, { useRef } from "react";
import { IoIosCheckmark } from "react-icons/io";
import { LuAsterisk } from "react-icons/lu";

const TableOfContents = ({ toc, onNavigate, currIndex = 8 }) => {
  const globalIndex = useRef(0);

  const renderTocItems = (items, level = 0) => {
    return (
      <ul style={{ listStyle: "none", paddingLeft: `${level * 16}px`, margin: 0 }}>
        {items.map((item) => {
          const showCheck = globalIndex.current < currIndex;
          const showAsterisk = globalIndex.current == currIndex;
          globalIndex.current += 1;

          return (
            <li key={item.id} style={{ padding: "10px 0", borderBottom: item.subitems && item.subitems.length > 0 ? "none" : "1px solid #eee" }}>
              <button
                onClick={() => onNavigate(item.href)}
                style={{
                  background: "none",
                  border: "none",
                  padding: '6px',
                  margin: 0,
                  color: showCheck ? "#ababab" : "black",
                  fontSize: "16px",
                  textAlign: "left",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: showCheck ? "400": "600",
                }}
              >
                {!showAsterisk ? (showCheck ? (<IoIosCheckmark size={24} color="#ababab" />) : (<IoIosCheckmark size={24} color="transparent" />)) : (<LuAsterisk size={24} color="black"/>)}
                {item.label}
              </button>
              {item.subitems && item.subitems.length > 0 && renderTocItems(item.subitems, level + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  globalIndex.current = 0;

  return <div style={{ width: "95%", overflowY: "auto", maxHeight: "100%"}}>
    <p style={{
        fontSize: '26px',
        fontWeight: '700'
    }}>Chapters</p>
    {renderTocItems(toc)}
    </div>;
};

export default TableOfContents;
