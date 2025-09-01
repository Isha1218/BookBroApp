import React from "react";

const LookUp = () => {
    return (
        <div style={{ width: "95%", overflowY: "auto", maxHeight: "100%" }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                paddingBottom: '15px',
                borderBottom: '1px solid black'
            }}>
                <p
                style={{
                    fontSize: "50px",
                    fontWeight: "700",
                    margin: 0,
                    fontFamily: 'Libre Caslon Text'
                }}>
                cassian
                </p>
                <p style={{
                    margin: 0,
                    fontSize: '20px',
                    fontFamily: 'Libre Caslon Text'
                }}>
                    character
                </p>
            </div>
            <p
            style={{
              fontSize: "18px",
              color: "black",
              lineHeight: "1.6",
              fontFamily: "Libre Caslon Text"
            }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
        </div>
      );
}

export default LookUp;