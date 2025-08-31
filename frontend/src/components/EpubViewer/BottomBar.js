import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { LuSettings2 } from "react-icons/lu";

const BottomBar = ({ position, showBar, onShowFeatureModal }) => {
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
          <button style={{
            background: 'none',
            border: 'none',
            margin: 0,
            padding: 0,
          }} onClick={onShowFeatureModal}><FiArrowLeft color='#ababab' size={Math.max(16, Math.min(24, window.innerWidth * 0.02))}/></button>
          <p style={{
            color: '#ababab',
            fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
          }}>{position}</p>
          <LuSettings2 color='#ababab' size={Math.max(16, Math.min(24, window.innerWidth * 0.02))}/>
        </div>
    )
}

export default BottomBar;