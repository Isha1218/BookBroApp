import React from "react";
import { LuTextSearch, LuBookOpenText } from "react-icons/lu";
import { TbCopy } from "react-icons/tb";

const Circle = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      backgroundColor: "#FFD658",
      borderRadius: "50%",
    }}
  />
);

const SelectionButton = ({ icon, text, iconSize, textSize }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: `calc(${textSize} / 2)`,
    }}
  >
    {React.cloneElement(icon, { size: iconSize })}
    <p
      style={{
        color: "white",
        margin: 0,
        fontSize: textSize,
        textAlign: "center",
      }}
    >
      {text}
    </p>
  </div>
);

const SelectionMenu = ({ position, isVisible }) => {
  const iconSize = `clamp(16px, 5vw, 28px)`;
  const textSize = `clamp(10px, 3vw, 14px)`;
  const gap = `clamp(20px, 4vw, 40px)`;

  if (!isVisible || !position) {
    return null;
  }

  const menuStyle = {
    backgroundColor: "black",
    position: "fixed",
    left: position.left,
    top: position.top,
    transform: position.transform,
    display: "flex",
    flexDirection: "row",
    zIndex: 1000,
    padding: `calc(${gap} / 2) ${gap}`,
    borderRadius: "15px",
    justifyContent: "center",
    gap: gap,
    maxWidth: "95vw",
    overflow: "hidden",
    // pointerEvents: "auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  };

  return (
    <div style={menuStyle}>
      <SelectionButton icon={<Circle />} text="Highlight" iconSize={iconSize} textSize={textSize} />
      {/* <SelectionButton icon={<LuBookOpenText color="white" />} text="Define" iconSize={iconSize} textSize={textSize} /> */}
      <SelectionButton icon={<LuTextSearch color="white" />} text="Look Up" iconSize={iconSize} textSize={textSize} />
      {/* <SelectionButton icon={<TbCopy color="white" />} text="Copy" iconSize={iconSize} textSize={textSize} /> */}
    </div>
  );
};

export default SelectionMenu;