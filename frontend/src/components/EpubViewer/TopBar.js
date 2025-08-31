import React from "react";

const TopBar = ({ title, showBar }) => {
    return (
        <div
          style={{
            opacity: showBar ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60px',
            width: '100%'
          }}
        >
          <p style={{
            color: '#ababab',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            margin: 0
          }}>{title}</p>
        </div>
    )
}

export default TopBar;