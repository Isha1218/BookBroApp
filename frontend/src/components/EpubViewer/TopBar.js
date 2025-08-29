import React from "react";

const TopBar = ({ title, showBar }) => {
    return (
        <div
          style={{
            opacity: showBar ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <p style={{
            color: 'gray',
            fontSize: '18px'
          }}>{title}</p>
        </div>
    )
}

export default TopBar;