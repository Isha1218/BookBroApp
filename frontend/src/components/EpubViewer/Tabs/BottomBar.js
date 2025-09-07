import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { LuSettings2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const BottomBar = ({ position, showBar }) => {
    const navigate = useNavigate();
    return (
        <div
          style={{
            opacity: showBar ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '90%',
            height: '40px'
          }}
        >
          <button 
          onClick={() => navigate("/homepage")}
          style={{
            background: 'none',
            border: 'none',
            margin: 0,
            padding: 0,
          }}><FiArrowLeft color='#ababab' size={Math.max(16, Math.min(24, window.innerWidth * 0.02))}/></button>
          <p style={{
            color: '#ababab',
            fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
          }}>{position}</p>
          <LuSettings2 color='transparent' size={Math.max(16, Math.min(24, window.innerWidth * 0.02))}/>
        </div>
    )
}

export default BottomBar;