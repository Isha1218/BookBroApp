import React, { forwardRef, useState, useEffect } from "react";
import { LuBookmark, LuSearch, LuList } from "react-icons/lu";
import { PiSkipBack } from "react-icons/pi";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { GiDualityMask } from "react-icons/gi";
import { LiaTheaterMasksSolid } from "react-icons/lia";


const iconSize = Math.max(18, Math.min(24, window.innerWidth * 0.02));

const MenuItem = ({ icon, label, onShowFeatureModal }) => (
  <button onClick={onShowFeatureModal} style={{
    all: 'unset',
  }}>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        whiteSpace: "nowrap",
        gap: "clamp(0.375rem, 2vw, 0.625rem)",
        fontSize: 'clamp(14px, 2.5vw, 16px)',
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
  </button>
);

const TopBar = forwardRef(({ showBar, onShowFeatureModal, showInitialRecap }, ref) => {
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
          opacity: showInitialRecap || showBar ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          display: "flex",
          flexDirection: "row",
          justifyContent: isOverflowing ? "flex-start" : "center",
          alignItems: "center",
          width: "90%",
          height: "40px",
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
    
        {showInitialRecap ? (
          <MenuItem
            icon={<PiSkipBack size={iconSize} color="#ababab" />}
            label="Previously On"
            onShowFeatureModal={() => onShowFeatureModal(2)}
          />
        ) : (
          <>
            <MenuItem
              icon={<LuList size={iconSize} color="#ababab" />}
              label="Chapters"
              onShowFeatureModal={() => onShowFeatureModal(0)}
            />
            <MenuItem
              icon={<IoChatboxEllipsesOutline size={iconSize} color="#ababab" />}
              label="Ask Bro"
              onShowFeatureModal={() => onShowFeatureModal(1)}
            />
            <MenuItem
              icon={<PiSkipBack size={iconSize} color="#ababab" />}
              label="Previously On"
              onShowFeatureModal={() => onShowFeatureModal(2)}
            />
            {/* <MenuItem
              icon={<LiaTheaterMasksSolid size={iconSize} color="#ababab" />}
              label="Scene It"
              onShowFeatureModal={() => onShowFeatureModal(3)}
            /> */}
            <MenuItem
              icon={<LuSearch size={iconSize} color="#ababab" />}
              label="Search"
              onShowFeatureModal={() => onShowFeatureModal(4)}
            />
          </>
        )}
      </div>
    )});
    

export default TopBar;