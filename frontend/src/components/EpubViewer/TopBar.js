import React, { forwardRef, useState, useEffect } from "react";
import { LuBookmark, LuSearch, LuList } from "react-icons/lu";
import { PiSkipBack } from "react-icons/pi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const iconSize = Math.max(16, Math.min(24, window.innerWidth * 0.02));

const MenuItem = ({ icon, label }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0,
      whiteSpace: "nowrap",
      gap: "clamp(0.375rem, 2vw, 0.625rem)",
      fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
      minWidth: 0,
    }}
  >
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </span>
    <span
      style={{
        color: "#ababab",
        margin: 0,
        flexShrink: 1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {label}
    </span>
  </div>
);

const TopBar = forwardRef(({ showBar }, ref) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
  
    useEffect(() => {
      if (!ref.current) return;
      const el = ref.current;
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }, [ref, showBar]);
  
    return (
      <div
        ref={ref}
        style={{
          opacity: showBar ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          display: "flex",
          flexDirection: "row",
          justifyContent: isOverflowing ? "flex-start" : "center",
          alignItems: "center",
          width: "90%",
          height: "60px",
          boxSizing: "border-box",
          gap: "clamp(1.25rem, 6vw, 3.125rem)",
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
  
        <MenuItem icon={<LuList size={iconSize} color="#ababab" />} label="Chapters" />
        <MenuItem icon={<LuBookmark size={iconSize} color="#ababab" />} label="Bookmark" />
        <MenuItem icon={<IoChatboxEllipsesOutline size={iconSize} color="#ababab" />} label="Chat" />
        <MenuItem icon={<PiSkipBack size={iconSize} color="#ababab" />} label="Recap" />
        <MenuItem icon={<LuSearch size={iconSize} color="#ababab" />} label="Search" />
      </div>
    );
  });

export default TopBar;