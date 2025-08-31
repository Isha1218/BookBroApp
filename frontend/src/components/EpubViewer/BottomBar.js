import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { LuSettings2 } from "react-icons/lu";

const BottomBar = ({ position, showBar }) => {
    return (
        <div
          style={{
            opacity: showBar ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%'
          }}
        >
          <FiArrowLeft color='#ababab' size={Math.max(16, Math.min(24, window.innerWidth * 0.02))}/>
          <p style={{
            color: '#ababab',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
          }}>{position}</p>
          <LuSettings2 color='#ababab' size={Math.max(16, Math.min(24, window.innerWidth * 0.02))}/>
        </div>
    )
}

export default BottomBar;