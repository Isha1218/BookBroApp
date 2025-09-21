import React, { forwardRef, useState, useEffect } from "react";
import { PencilLine, Book } from "lucide-react";
import { LuTextSearch } from "react-icons/lu";
import { BsHighlighter, BsQuestionLg } from "react-icons/bs";
import { TbQuestionMark } from "react-icons/tb";
import { BsWikipedia } from "react-icons/bs";
import { PiQuestion } from "react-icons/pi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { LuScanFace } from "react-icons/lu";
import { FaRegAddressBook } from "react-icons/fa";
import { BiConfused } from "react-icons/bi";
import { BsPersonVcard } from "react-icons/bs";



const iconSize = Math.max(16, Math.min(24, window.innerWidth * 0.02));

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
    </button>
  );
  

const SelectionMenu = forwardRef(({ showBar, onShowFeatureModal, onHighlight }, ref) => {
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
  
        <MenuItem icon={<BsHighlighter size={iconSize} color="#ababab"/>} label="Highlight" onShowFeatureModal={() => onHighlight()} />
        <MenuItem icon={<TbQuestionMark size={iconSize} color="#ababab"/>} label="Who's That" onShowFeatureModal={() => onShowFeatureModal(5)} />
      </div>
    );
  });

export default SelectionMenu;